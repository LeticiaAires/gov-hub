# Credenciais de acesso

> Guia prático para solicitar e configurar acesso às APIs dos sistemas estruturantes SIAFI e SIAPE, conforme orientações institucionais vigentes.

---

## SIAFI (Sistema Integrado de Administração Financeira)

### APIs gratuitas
- SIAFI – Consultar Tabelas Administrativas — Catálogo de APIs governamentais
- SIAFI – Manter Contas a Pagar e Receber — Catálogo de APIs governamentais
- SIAFI – Manter Programação — Catálogo de APIs governamentais
- SIAFI – Módulo Orçamentário — Catálogo de APIs governamentais

### Solicitação de acesso

Antes de solicitar o acesso à API do SIAFI, configure um ambiente com certificado digital A1 assinado e cadastre o sistema no SIAFI Web.

1) Configurar ambiente com certificado A1

- Gerar um Certificado Digital de Equipamento (A1) para o sistema cliente.
- Manter o arquivo no padrão X.509 (ex.: .cer, .crt, .p7b, .pem).

2) Cadastrar o certificado e o sistema no SIAFI Web

- Cadastrar o certificado gerado no SIAFI Web.
- Utilizar a transação INCSISORIG (Incluir Sistema de Origem) para cadastrar o sistema cliente.
- Informações exigidas no cadastro:
    - Sigla do sistema cliente;
    - Sigla do órgão ao qual o sistema pertence;
    - Nome do sistema (tradução da sigla + detalhes relevantes);
    - Informações de contato;
    - Arquivo do Certificado Digital de Equipamento A1 no padrão X.509.

3) Testar a comunicação

- Após o cadastro, realizar testes de comunicação (homologação e/ou produção conforme o caso).

4) Solicitar usuários SIAFI

- O órgão deve providenciar o cadastro de usuários no SIAFI no respectivo sistema de destino (Produção e/ou Homologação) para envio das requisições, caso não tenham.

Mais informações: Informações sobre a integração com o SIAFI — [Tesouro Nacional](https://www.gov.br/tesouronacional/pt-br/central-de-conteudo/apis/siafi/informacoes-sobre-a-integracao-com-o-siafi).

### APIs pagas
- Integra SIAFI – Nota de Crédito e de Dotação — [Catálogo de APIs governamentais](https://www.gov.br/conecta/catalogo/apis/integra-siafi).
- Serviço deve ser contratado junto ao SERPRO: https://loja.serpro.gov.br/integrasiafi

### Área responsável
- Coordenação-Geral de Sistemas e Tecnologia de Informação - COSIS/STN
- E-mail: ti.stn@tesouro.gov.br
- Telefone: (61) 3412-7900
- Horário de atendimento: comercial

### Solicitações internas (órgão)
- Solicitar para o órgão a disponibilização de um ambiente com certificado digital A1.
- Solicitar para o órgão a inclusão do sistema cliente no SIAFI Web.
- Solicitar para o órgão a criação dos nossos usuários no SIAFI Web.

---


## SIAPE (Sistema Integrado de Administração de Pessoal)

### APIs
- SIAPE Ocorrências - Servidores Públicos Federais — [Catálogo de APIs governamentais](https://www.gov.br/conecta/catalogo/apis/siape-ocorrencias)
- Registro de Referência - Servidores Públicos Federais — [SIAPE Consultas](https://www.gov.br/conecta/catalogo/apis/consulta-siape)

### Solicitação de acesso
O acesso é intermediado pelo Conecta (plataforma de integração) e pela SGPRT.

1) Manifestar interesse

- Enviar e-mail para conecta@economia.gov.br indicando o interesse de uso da API do SIAPE.

2) Assinar o ofício de adesão ao Conecta

- Você receberá a minuta do ofício de adesão; preencher, assinar e devolver conforme instruções.
- Pontos de atenção:
    - Definir claramente a finalidade do uso dos dados (LGPD);
    - Não é necessária análise jurídica;
    - Assinaturas: Dirigente de TI e Responsável Técnico;
    - Definir a volumetria anual desejada (01/01 a 31/12);
    - O ofício pode incluir outras APIs disponibilizadas pelo Conecta.

3) Autorização de acesso

- O Conecta encaminhará a solicitação à SGPRT; a SGPRT poderá entrar em contato para esclarecimentos.
- Após análise, você receberá ofício por e-mail:
    - Em caso de deferimento: virão orientações técnicas e geração da chave de acesso;
    - Em caso de indeferimento: virá a justificativa no próprio ofício.

### Área responsável
- CGSER/DESIN/SGPRT/MGI
- E-mail: sgp.sustentacao@economia.gov.br
- Telefone: (61) 2020-8589

### Solicitação interna (órgão)
- Solicitar para o órgão o envio do e-mail ao conecta@economia.gov.br.

---

> Boas práticas
- Segurança: segregue ambientes (homologação/produção) e proteja chaves e certificados.
- Observabilidade: registre logs das integrações e trate erros de autenticação/autorização.
- Conformidade: garanta aderência à LGPD e à minimização de dados.
