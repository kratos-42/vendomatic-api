# 🏪 Vendomatic - Sistema de Gestão de Máquinas de Venda Automática

## 📋 Visão Geral do Projeto

O **Vendomatic** é um sistema de dashboard/backoffice para gestão e monitorização de máquinas de venda automática de uma empresa. O sistema permite o controle completo das operações, desde a gestão de máquinas e produtos até ao acompanhamento de reabastecimentos e manutenção.

## 🎯 Objetivos Principais

### Gestão de Máquinas

- Adicionar, remover e alterar localização das máquinas
- Monitorizar o estado operacional de cada máquina
- Registar informações de localização e configuração

### Gestão de Produtos

- Gerir produtos em cada máquina individualmente
- Definir preços variáveis por localização
- Controlar stock e disponibilidade

### Controlo de Reabastecimentos

- Registar reabastecimentos com detalhes completos
- Rastrear quantidades adicionadas e dinheiro recolhido
- Documentar produtos descartados (desperdício)
- Associar funcionário responsável a cada operação

### Manutenção e Monitorização

- Registar atividades de manutenção
- Acompanhar histórico de intervenções
- Análise estatística (implementação futura)

---

## 👥 User Stories

### 🏢 Gestão de Máquinas

**US001 - Adicionar Nova Máquina**

> Como administrador, quero adicionar uma nova máquina ao sistema para poder começar a monitorizá-la.
>

**Critérios de Aceitação:**

- Posso inserir localização, código identificador e configurações iniciais
- O sistema valida se o código da máquina é único
- A máquina fica imediatamente disponível para gestão de produtos

**US002 - Alterar Localização de Máquina**

> Como administrador, quero alterar a localização de uma máquina existente para manter os dados atualizados.
>

**Critérios de Aceitação:**

- Posso selecionar uma máquina existente
- Posso alterar a localização mantendo o histórico
- Os preços dos produtos são atualizados conforme a nova localização

**US003 - Remover Máquina**

> Como administrador, quero remover uma máquina do sistema quando ela é desativada.
>

**Critérios de Aceitação:**

- Posso marcar uma máquina como inativa
- O histórico de operações é mantido
- A máquina não aparece nas operações ativas

### 🛍️ Gestão de Produtos

**US004 - Adicionar Produto à Máquina**

> Como administrador, quero adicionar um produto a uma máquina específica para disponibilizá-lo aos clientes.
>

**Critérios de Aceitação:**

- Posso selecionar produto do catálogo ou criar novo
- Posso definir preço específico para a localização
- Posso definir quantidade inicial e capacidade máxima

**US005 - Atualizar Preço de Produto**

> Como administrador, quero atualizar o preço de um produto numa máquina específica.
>

**Critérios de Aceitação:**

- Posso alterar preço mantendo histórico de alterações
- A alteração é específica para a máquina/localização
- Sistema regista data e utilizador da alteração

**US006 - Remover Produto da Máquina**

> Como administrador, quero remover um produto de uma máquina quando não está mais disponível.
>

**Critérios de Aceitação:**

- Posso remover produto mantendo histórico
- Sistema alerta se há stock existente
- Remoção não afeta outras máquinas

### 📦 Gestão de Reabastecimentos

**US007 - Registar Reabastecimento**

> Como funcionário, quero registar um reabastecimento para manter o controlo de stock e dinheiro.
>

**Critérios de Aceitação:**

- Posso selecionar máquina e produtos reabastecidos
- Posso inserir quantidades adicionadas por produto
- Posso registar valor monetário recolhido
- Sistema regista automaticamente minha identificação

**US008 - Registar Desperdício**

> Como funcionário, quero registar produtos descartados durante o reabastecimento.
>

**Critérios de Aceitação:**

- Posso selecionar produtos descartados e quantidades
- Sistema calcula valor monetário do desperdício
- Posso adicionar motivo do descarte
- Informação fica associada ao reabastecimento

**US009 - Consultar Histórico de Reabastecimentos**

> Como administrador, quero consultar o histórico de reabastecimentos para análise operacional.
>

**Critérios de Aceitação:**

- Posso filtrar por máquina, funcionário ou período
- Posso ver detalhes de cada reabastecimento
- Posso exportar relatórios

### 🔧 Gestão de Manutenção

**US010 - Registar Manutenção**

> Como técnico, quero registar atividades de manutenção realizadas numa máquina.
>

**Critérios de Aceitação:**

- Posso selecionar máquina e tipo de manutenção
- Posso inserir descrição detalhada da intervenção
- Sistema regista data, hora e técnico responsável
- Posso anexar fotos ou documentos

**US011 - Consultar Histórico de Manutenção**

> Como administrador, quero consultar o histórico de manutenção para planeamento preventivo.
>

**Critérios de Aceitação:**

- Posso filtrar por máquina, tipo ou período
- Posso ver frequência de intervenções
- Posso identificar máquinas com mais problemas

### 📊 Relatórios e Análise (Implementação Futura)

**US012 - Visualizar Estatísticas de Vendas**

> Como administrador, quero visualizar estatísticas gráficas de vendas por produto e máquina.
>

**US013 - Análise de Rentabilidade**

> Como gestor, quero analisar a rentabilidade de cada máquina e localização.
>

**US014 - Relatório de Desperdício**

> Como administrador, quero analisar padrões de desperdício para otimizar operações.
>

---

## 🔐 Perfis de Utilizador

### Administrador

- Acesso completo a todas as funcionalidades
- Gestão de utilizadores e permissões
- Acesso a relatórios e análises

### Funcionário/Técnico

- Registar reabastecimentos e manutenção
- Consultar informações das máquinas
- Acesso limitado a relatórios

### Gestor

- Visualizar relatórios e análises
- Monitorizar performance operacional
- Não pode alterar configurações

---

## 🛠️ Funcionalidades Técnicas

### Autenticação e Autorização

- Sistema de login seguro
- Gestão de perfis e permissões
- Auditoria de ações dos utilizadores

### Interface Responsiva

- Dashboard adaptável a diferentes dispositivos
- Navegação intuitiva e eficiente
- Feedback visual para ações do utilizador

### Gestão de Dados

- Base de dados robusta e escalável
- Backup automático de informações
- Exportação de dados em diferentes formatos
