# Do lead à proposta · Stack

Ferramenta interna do comercial da Stack.

**Leads**: lista de todos os leads com funil (Novo → Qualificado → Proposta enviada → Em negociação → Cliente aceitou / Não aceitou), totais em R$, taxa de conversão, busca, histórico e motivo de perda.

**Acompanhamento**: cada lead tem uma barra com as etapas e datas, observações de follow-up (ligação, WhatsApp, e-mail, reunião), data do próximo contato e alerta de retornos atrasados. Ao enviar a proposta, o retorno é marcado para 3 dias depois.

**Aprendizado**: com os leads fechados, o sistema mostra taxa de aceite por faixa de preço, ticket médio, nota média, motivos de perda e compara horas reais com estimadas. Essas dicas aparecem também na hora de montar um novo orçamento.

**Novo lead** em 4 passos:

1. **Cliente**: nome da empresa e propostas salvas.
2. **Qualificação**: lead scoring de 0 a 100 com 6 critérios.
3. **Dores**: cada dor do cliente vira uma solução com esforço, prazo e preço.
4. **Proposta**: investimento, prazo, mensalidade, ordem de entrega e texto pronto para enviar.

**Opções**: valor-hora da Stack, backup (baixar/restaurar .json) e apagar dados.

Os leads ficam salvos no navegador de quem usa (localStorage). Use o backup em Opções para levar para outro computador.

## Deploy

Site estático, sem build. Na Vercel: **Add New → Project**, importe este repositório e clique em **Deploy**.

## Acesso

O site pede usuário e senha antes de abrir (arquivo `middleware.js`, roda na Vercel).
Para trocar o acesso sem mexer no código, crie na Vercel (Settings → Environment Variables)
as variáveis `AUTH_USER` e `AUTH_PASS` e faça um novo deploy.
