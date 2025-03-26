![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-pocketbase-master

Este pacote contém nós personalizados para integrar o PocketBase com o n8n.

## Instalação

### No n8n

1. Vá para **Settings > Community Nodes**
2. Selecione **Install**
3. Digite `n8n-nodes-pocketbase-master` no campo de busca
4. Clique em instalar

### Manualmente

```bash
npm install n8n-nodes-pocketbase-master
```

## Operações Suportadas

### Record

O nó suporta as seguintes operações para registros:

#### Create
- Cria um novo registro em uma coleção
- Parâmetros:
  - Collection: Nome da coleção
  - Data: Dados do registro em formato JSON

#### Create with Files
- Cria um novo registro com upload de arquivos
- Parâmetros:
  - Collection: Nome da coleção
  - Fields Data: Campos regulares do registro
  - Binary Property: Propriedade binária contendo os arquivos
  - File Field Names: Nomes dos campos que receberão os arquivos

#### Delete
- Remove um registro específico
- Parâmetros:
  - Collection: Nome da coleção
  - Record ID: ID do registro a ser removido

#### Get
- Obtém um registro específico
- Parâmetros:
  - Collection: Nome da coleção
  - Record ID: ID do registro
  - Expand Relations: Lista de relações a serem expandidas

#### Get Many
- Obtém múltiplos registros com suporte a filtros e paginação
- Parâmetros:
  - Collection: Nome da coleção
  - Return All: Se deve retornar todos os resultados
  - Limit: Número máximo de resultados (se Return All for false)
  - Filter: Critérios de filtro
  - Sort: Ordenação dos resultados
  - Expand Relations: Lista de relações a serem expandidas

#### Multi-Table Query
- Consulta registros em múltiplas tabelas simultaneamente
- Parâmetros para cada tabela:
  - Collection Name: Nome da coleção
  - Filter: Critérios de filtro específicos da tabela
  - Fields: Campos a serem retornados
  - Expand Relations: Lista de relações a serem expandidas
  - Limit: Número máximo de resultados
- Opções adicionais:
  - Merge Results: Combina resultados baseado em um campo comum
  - Merge Field: Campo usado para combinar resultados
  - Remove Duplicates: Remove entradas duplicadas ao combinar

#### Update
- Atualiza um registro existente
- Parâmetros:
  - Collection: Nome da coleção
  - Record ID: ID do registro
  - Data: Novos dados em formato JSON

#### Update with Files
- Atualiza um registro existente com suporte a arquivos
- Parâmetros:
  - Collection: Nome da coleção
  - Record ID: ID do registro
  - Fields Data: Campos regulares do registro
  - Binary Property: Propriedade binária contendo os arquivos
  - File Field Names: Nomes dos campos que receberão os arquivos
  - Append Files: Se deve anexar ou substituir arquivos existentes

## Expansão de Relações

O nó agora suporta expansão de relações em várias operações (Get, Get Many, Multi-Table Query). Isso permite buscar dados relacionados em uma única consulta.

### Exemplos de Uso

1. **Buscar aluno com sua turma e colégio:**
   ```
   Expand Relations: "turma,turma.colegio"
   ```

2. **Buscar turma com todos os alunos e professor:**
   ```
   Expand Relations: "alunos,professor"
   ```

3. **Buscar colégio com turmas e seus respectivos professores:**
   ```
   Expand Relations: "turmas,turmas.professor"
   ```

### Sintaxe de Expansão

- Use vírgula (,) para expandir múltiplas relações
- Use ponto (.) para expandir relações aninhadas
- Exemplo: "relacao1,relacao2.subrelacao,relacao3"

## Autenticação

O nó suporta dois métodos de autenticação:

1. **Email/Senha**
   - Use credenciais de administrador do PocketBase
   - Recomendado para desenvolvimento e testes

2. **Token de API**
   - Use um token de API gerado no PocketBase
   - Recomendado para produção

## Tratamento de Erros

O nó inclui tratamento robusto de erros e validações:
- Verificação de autenticação
- Validação de parâmetros
- Mensagens de erro descritivas
- Opção de continuar em caso de falha

## Exemplos

### Buscar Alunos de uma Turma Específica

```json
{
  "operation": "getMany",
  "collection": "alunos",
  "filter": "turma.id = 'abc123'",
  "expand": "turma,turma.colegio"
}
```

### Atualizar Foto do Perfil do Aluno

```json
{
  "operation": "updateWithFiles",
  "collection": "alunos",
  "recordId": "xyz789",
  "fileFieldNames": "foto_perfil",
  "appendFiles": false
}
```

### Consulta Multi-Tabela com Relações

```json
{
  "operation": "multiTableQuery",
  "tables": [
    {
      "collection": "alunos",
      "expand": "turma",
      "filter": "ativo = true"
    },
    {
      "collection": "professores",
      "expand": "turmas,departamento",
      "filter": "status = 'ativo'"
    }
  ],
  "options": {
    "mergeResults": true,
    "mergeField": "turma_id"
  }
}
```

## Licença

[MIT](LICENSE.md)
