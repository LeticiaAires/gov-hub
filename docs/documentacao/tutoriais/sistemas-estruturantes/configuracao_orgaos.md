# Configuração de órgãos no GovHub

Este documento explica como configurar o GovHub para funcionar com diferentes órgãos públicos através da configuração de variáveis no Airflow.

## Como funciona

O sistema utiliza duas variáveis principais no Airflow para determinar qual órgão será processado:

1. **`airflow_orgao`**: Define qual órgão está ativo
2. **`airflow_variables`**: Contém a configuração de códigos UG para todos os órgãos

## Configuração das variáveis

### 1. Variável do órgão ativo

**Chave**: `airflow_orgao`  
**Valor**: O identificador do órgão (ex: `ipea`, `unb`, `ibama`, `mgi`)

### 2. Variável de configuração dos órgãos

**Chave**: `airflow_variables`  
**Valor**: JSON com a configuração de códigos UG para cada órgão

```json
{
  "nome_do_orgao": {
    "codigos_ug": [codigo1, codigo2, codigo3]
  }
}
```

## Como Configurar um Novo Órgão

### Passo 1: Identificar os códigos UG
Primeiro, você precisa identificar os códigos de Unidade Gestora (UG) do órgão que deseja configurar.

### Passo 2: Atualizar a variável `airflow_variables`
Adicione o novo órgão na configuração JSON:

```json
{
  "orgao_existente": {
    "codigos_ug": [123456]
  },
  "novo_orgao": {
    "codigos_ug": [789012, 345678]
  }
}
```

### Passo 3: Alterar o órgão ativo
Modifique a variável `airflow_orgao` para o identificador do novo órgão:

```
airflow_orgao = novo_orgao
```

## Exemplo prático

Para configurar o sistema para trabalhar com a Universidade Federal de Minas Gerais (UFMG):

1. **Adicionar na `airflow_variables`**:
```json
{
  "ipea": {
    "codigos_ug": [113601, 113602]
  },
  "ufmg": {
    "codigos_ug": [154020, 154021]
  }
}
```

2. **Alterar `airflow_orgao`**:
```
airflow_orgao = ufmg
```

<details>
<summary>Configuração atual das variáveis</summary>

Variável: airflow_orgao
```
ipea
```

Variável: airflow_variables
```json
{
  "ipea": {
    "codigos_ug": [113601, 113602]
  },
  "unb": {
    "codigos_ug": [154040]
  },
  "ibama": {
    "codigos_ug": [440001, 440048, 440050]
  },
  "mgi": {
    "codigos_ug": [201082]
  }
}
```

</details>

## Observações

- **Backup**: Sempre faça backup das configurações antes de alterá-las
- **Reinicialização**: Após alterar as variáveis, reinicie os DAGs afetados
- **Validação**: Verifique se os códigos UG estão corretos antes de executar
- **Múltiplos Códigos**: Um órgão pode ter múltiplos códigos UG (como mostrado nos exemplos)
