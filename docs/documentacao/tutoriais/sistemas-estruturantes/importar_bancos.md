# GovHub - Integração com sistemas estruturantes

O **GovHub** é uma plataforma livre e colaborativa voltada à integração de dados e informações governamentais. A proposta central do projeto é enfrentar um dos maiores desafios da gestão pública: a fragmentação e a inconsistência dos dados entre os diversos sistemas governamentais.

O objetivo desta página é apresentar as principais fontes que estamos utilizando ao consultar dados públicos e apresentar um direcionamento de onde essas documentações especifícas podem ser usadas, de forma geral, quando quisermos importar dados de algum sistema utilizaremos suas APIS para fazer a solicitação.

- **Clientes REST**: `httpx` (timeout padrão 10s, até 3 tentativas com backoff exponencial)
- **Clientes SOAP**: `Zeep`/`requests` com WS-Security (quando necessário) e retentativas onde aplicável
- **Logging**: presente em todos os clientes e DAGs de ingestão
- **Execução**: DAGs do Airflow orquestram a ingestão e persistência em Postgres

Para SIAFI e SIAPE é necessário credencial. Veja "Credenciais de acesso" (link ao final).

Para entender como solicitar e configurar o acesso institucional às APIs do SIAFI e SIAPE, consulte: [Credenciais de acesso](acesso-apis-siafi-siape.md).

---

## Compras Gov - Contratos API

- **Base URL**: `https://contratos.comprasnet.gov.br/api`
- **Autenticação**: pública
- **Headers**: `accept: application/json`
- **Cliente no código**: `airflow_lappis/plugins/cliente_contratos.py`
- [**Documentação/Endpoints**](https://contratos.comprasnet.gov.br/api/docs)
- **Endpoints utilizados**:

    + `GET /contrato/ug/{ug}` 
    + `GET /contrato/inativo/ug/{ug}`
    + `GET /contrato/{id}/faturas`
    + `GET /contrato/{id}/empenhos`
    + `GET /contrato/{id}/cronograma`
    + `GET /contrato/{id}/terceirizados`

<details>
<summary>Exemplos cURL</summary>

```bash
# Contratos ativos por UG
curl -s 'https://contratos.comprasnet.gov.br/api/contrato/ug/113601' \
  -H 'accept: application/json'

# Faturas de um contrato
curl -s 'https://contratos.comprasnet.gov.br/api/contrato/123456/faturas' \
  -H 'accept: application/json'
```

</details>

**Observações**:
- As DAGs de ingestão usam a variável do Airflow `airflow_orgao` e um mapeamento em `airflow_variables` para obter a lista de UGs.

---

## SIORG - Estrutura Organizacional

- **Base URL**: `https://estruturaorganizacional.dados.gov.br/doc`
- **Autenticação**: pública
- **Cliente no código**: `airflow_lappis/plugins/cliente_siorg.py`
- [**Documentação/Endpoints**](https://api.siorg.economia.gov.br/)
- **Endpoints utilizados**:
    - `GET /estrutura-organizacional/resumida?codigoPoder=&codigoEsfera=&codigoUnidade=`
    - `GET /instancias/consulta-unidade?codigoUnidade=`
    - `GET /cargo-funcao`

<details>
<summary>Exemplos cURL</summary>

```bash
# Estrutura organizacional resumida por unidade
curl -s 'https://estruturaorganizacional.dados.gov.br/doc/estrutura-organizacional/resumida?codigoUnidade=26278'

# Consulta de unidade
curl -s 'https://estruturaorganizacional.dados.gov.br/doc/instancias/consulta-unidade?codigoUnidade=26278' \
  -H 'accept: */*'
```

</details>

---

## TransfereGov - TED (PostgREST)

- **Base URL**: `https://api.transferegov.gestao.gov.br/ted/`
- **Autenticação**: pública (conforme uso no projeto)
- **Headers**: `accept: application/json`
- **Cliente no código**: `airflow_lappis/plugins/cliente_ted.py`
- [**Documentação/Endpoints**](https://docs.api.transferegov.gestao.gov.br/ted/)
- **Endpoints utilizados**:

    - `GET programa?id_programa=eq.{id}`
    - `GET programa_beneficiario?tx_codigo_siorg=eq.{codigo}`
    - `GET plano_acao?id_programa=eq.{id}`
    - `GET nota_credito?cd_ug_favorecida_nota=eq.{ug}` e/ou `cd_ug_emitente_nota=eq.{ug}`
    - `GET programacao_financeira?ug_favorecida_programacao=eq.{ug}` e/ou `ug_emitente_programacao=eq.{ug}`

<details>
<summary>Exemplos cURL</summary>

```bash
# Programa por id
curl -s 'https://api.transferegov.gestao.gov.br/ted/programa?id_programa=eq.900000' \
  -H 'accept: application/json'

# Notas de crédito por UG favorecida
curl -s 'https://api.transferegov.gestao.gov.br/ted/nota_credito?cd_ug_favorecida_nota=eq.113601' \
  -H 'accept: application/json'
```

</details>

---

## SIAFI - SOAP e Integra SERPRO

Este projeto usa duas integrações distintas:

### 1) SOAP do SIAFI (Tesouro)

- **Base**: `https://servicos-siafi.tesouro.gov.br/siafi{ANO}` (ex.: `siafi2024`)
- **WSDL**: `https://servicos-siafi.tesouro.gov.br/siafi{ANO}/{endpoint}?wsdl`
- **Autenticação**: certificado de cliente + WS-Security UsernameToken
- **Cliente no código**: `airflow_lappis/plugins/cliente_siafi.py`
- **Documentação**: [**Catálogo ConectaGov**](https://www.gov.br/conecta/catalogo/apis/siafi-2013-modulo-orcamentario)
- **Exemplos de serviços usados**:

    - `services/orcamentario/manterOrcamentario` (ex.: `orcDetalharEmpenho`)
    - `services/pf/manterProgramacaoFinanceira` (ex.: `pfDetalharProgramacaoFinanceira`)

- **Resiliência**: uso de decorador de retry com até 3 tentativas (backoff exponencial)


**Variáveis de ambiente (SOAP)**:

  * `SIAFI_CERT` (caminho do .crt ou .pem)
  * `SIAFI_KEY` (caminho da chave privada)
  * `SIAFI_USERNAME`, `SIAFI_PASSWORD`

<details>
<summary>Exemplo cURL (ilustrativo)</summary>

```bash
# Envio SOAP com mTLS (certificado e chave)
curl -s --cert "$SIAFI_CERT" --key "$SIAFI_KEY" \
  -H 'Content-Type: text/xml' \
  --data-binary @request.xml \
  'https://servicos-siafi.tesouro.gov.br/siafi2024/services/orcamentario/manterOrcamentario'
```

</details>

### 2) Integra SERPRO (REST Nota de Crédito)

- **Token**: `POST https://gateway.apiserpro.serpro.gov.br/token` (OAuth2 client_credentials em Basic Auth)
- **API**: `https://gateway.apiserpro.serpro.gov.br/api-integra-siafi/api`
- **Endpoint usado**: `GET /v2/nota-credito/{ug}/{gestao}/{ano}/{numero}`
- **Headers**: `Authorization: Bearer <token>`, `x-credencial: base64(<cpf>.<ug>.SIAFI<ano>)`
- **Observação** (implementação atual): a UG utilizada para compor o `x-credencial` está fixa como `113601` no cliente. Ajuste no código se necessário para outros órgãos.

**Variáveis de ambiente (REST SERPRO)**:

- `SIAFI_BEARER_KEY_SERPRO`, `SIAFI_BEARER_SECRET_SERPRO`, `SIAFI_CPF_SERPRO`

<details>
<summary>Exemplos cURL</summary>

```bash
# 1) Obter token
TOKEN=$(curl -s -u "$SIAFI_BEARER_KEY_SERPRO:$SIAFI_BEARER_SECRET_SERPRO" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  'https://gateway.apiserpro.serpro.gov.br/token' | jq -r .access_token)

# 2) Montar x-credencial (exemplo: CPF.UG.SIAFIANO => base64)
X_CRED=$(printf '%s' "$SIAFI_CPF_SERPRO.113601.SIAFI2024" | base64)

# 3) Consultar Nota de Crédito
curl -s 'https://gateway.apiserpro.serpro.gov.br/api-integra-siafi/api/v2/nota-credito/113601/010000/2024/000123' \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-credencial: $X_CRED" \
  -H 'accept: application/json'
```

</details>

---

## SIAPE - SOAP via ConectaGov

- **Token**: `POST https://apigateway.conectagov.estaleiro.serpro.gov.br/oauth2/jwt-token/` (OAuth2 client_credentials)
- **Endpoint SOAP**: `POST https://apigateway.conectagov.estaleiro.serpro.gov.br/api-consulta-siape/v1/consulta-siape`
- **Headers**: `Authorization: Bearer <token>`, `x-cpf-usuario: <CPF>`, `Content-Type: application/xml`
- **Templates XML**: `airflow_lappis/templates/siape/*.xml.j2`
- **Cliente no código**: `airflow_lappis/plugins/cliente_siape.py` (Jinja2 + requests)
- **Requisito de ambiente**: `AIRFLOW_REPO_BASE` deve apontar para a raiz do repositório para resolução dos templates Jinja2
- **Documentação**: [**Catálogo ConectaGov**](https://www.gov.br/conecta/catalogo/apis/consulta-siape)

**Templates suportados no repositório** (exemplos):

- `consultaDadosPessoais.xml.j2`
- `consultaDadosFuncionais.xml.j2`
- `consultaDadosFinanceiros.xml.j2`
- `consultaDadosDependentes.xml.j2`
- `consultaDadosAfastamento.xml.j2`, `consultaDadosAfastamentoHistorico.xml.j2`
- `listaServidores.xml.j2`, `listaUorgs.xml.j2`

**Notas importantes**:

- O cliente SIAPE utiliza `requests` e constrói o XML via Jinja2; retentativas automáticas não estão aplicadas por padrão nesse cliente (podem ser adicionadas via helper de retry, se necessário).
- Em ambientes Docker (compose), garanta que a pasta `airflow_lappis/templates` esteja disponível em `AIRFLOW_REPO_BASE/templates`. No compose fornecido, `AIRFLOW_REPO_BASE` aponta para `${AIRFLOW_HOME}`; monte os templates nessa pasta ou ajuste a variável para apontar para a raiz do repositório.

**Variáveis de ambiente**:

- `SIAPE_BEARER_USER`, `SIAPE_BEARER_PASSWORD` (client credentials)
- `SIAPE_CPF_USER` (preenche header `x-cpf-usuario`)

<details>
<summary>Exemplos cURL</summary>

```bash
# 1) Obter token
TOKEN=$(curl -s -u "$SIAPE_BEARER_USER:$SIAPE_BEARER_PASSWORD" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  'https://apigateway.conectagov.estaleiro.serpro.gov.br/oauth2/jwt-token/' | jq -r .access_token)

# 2) Chamada SOAP (exemplo: consultaDadosPessoais)
cat > /tmp/consultaDadosPessoais.xml <<'XML'
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servico.wssiapenet">
  <soapenv:Header/>
  <soapenv:Body>
    <ser:consultaDadosPessoais>
      <siglaSistema>SIGLA</siglaSistema>
      <nomeSistema>NOME-SISTEMA</nomeSistema>
      <senha>SENHA</senha>
      <cpf>00000000000</cpf>
      <codOrgao>00000</codOrgao>
      <parmExistPag>S</parmExistPag>
      <parmTipoVinculo>TODOS</parmTipoVinculo>
    </ser:consultaDadosPessoais>
  </soapenv:Body>
  </soapenv:Envelope>
XML

curl -s -X POST \
  'https://apigateway.conectagov.estaleiro.serpro.gov.br/api-consulta-siape/v1/consulta-siape' \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-cpf-usuario: $SIAPE_CPF_USER" \
  -H 'Content-Type: application/xml' \
  --data-binary @/tmp/consultaDadosPessoais.xml
```

</details>

---

## Comportamento de Rede e Resiliência

- **Timeout padrão**: 10s (clientes REST httpx)
- **Retentativas**: até 3 (exponencial). Aplicado em SIAFI (SOAP Zeep) e Integra SERPRO (REST). Para SIAPE, aplicar conforme necessidade.
- **Content negotiation**: JSON para REST; XML para SOAP

---

## Credenciais de Acesso

As instruções de como obter e gerenciar credenciais de SIAFI e SIAPE estão em um documento separado:

- Veja: [Credenciais de acesso](acesso-apis-siafi-siape.md).

**Configuração recomendada**:

- Defina as variáveis sensíveis no `.env` consumido pelo `docker-compose.yml` (ou diretamente nas Variáveis do Airflow em produção).
- Verifique que certificados e chaves do SIAFI (mTLS) estejam acessíveis no container e com permissões corretas.


