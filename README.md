# Do lead à proposta · Stack

Ferramenta interna do comercial da Stack.

**Leads**: lista de todos os leads com funil (Novo → Qualificado → Proposta enviada → Em negociação → Cliente aceitou / Não aceitou), totais em R$, taxa de conversão, busca, histórico e motivo de perda.

**Novo lead** em 4 passos:

1. **Cliente**: nome da empresa e propostas salvas.
2. **Qualificação**: lead scoring de 0 a 100 com 6 critérios.
3. **Dores**: cada dor do cliente vira uma solução com esforço, prazo e preço.
4. **Proposta**: investimento, prazo, mensalidade, ordem de entrega e texto pronto para enviar.

**Opções**: valor-hora da Stack, backup (baixar/restaurar .json) e apagar dados.

Os leads ficam salvos no navegador de quem usa (localStorage). Use o backup em Opções para levar para outro computador.

## Deploy

Site estático, sem build. Na Vercel: **Add New → Project**, importe este repositório e clique em **Deploy**.
