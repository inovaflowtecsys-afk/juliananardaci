# Contributing

Obrigado por contribuir com este projeto.

## Fluxo de trabalho

1. Crie uma branch a partir de `main`.
2. Implemente a mudanca de forma pequena e objetiva.
3. Rode os checks locais antes do commit:
   - `npm run lint`
   - `npm run build`
4. Abra um Pull Request usando o template.
5. Aguarde CI verde e revisao de codigo.

## Padrao de branches

Use nomes descritivos:

- `feat/nome-curto`
- `fix/nome-curto`
- `chore/nome-curto`
- `docs/nome-curto`

## Padrao de commits

Use mensagens curtas e no imperativo, por exemplo:

- `feat: add client filtering`
- `fix: handle empty supplier list`
- `chore: update dependencies`

## Checklist de PR

- Escopo pequeno e revisavel
- Sem codigo morto
- Sem dados sensiveis
- UI validada em desktop e mobile
- Riscos e rollback descritos no PR

## Reporte de bugs

Use o template de issue de bug em `.github/ISSUE_TEMPLATE/bug_report.yml`.
