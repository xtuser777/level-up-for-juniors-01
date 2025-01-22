# Level Up for Juniors 01 - Sistema de vendas de ingressos

<div style="background-color: black; display: inline-block;">
  <img src="./doc-assets/logo.svg" alt="Level Up for Juniors">
</div>

## Requerimentos

- Node.js 20+
- Docker



### Docker

Dependendo do seu sistema operacional, você tem 2 opções para instalar o Docker:

- [Docker Desktop] - Interface gráfica para gerenciar e usar o Docker.
- [Docker Engine] - Apenas a engine do Docker, sem interface gráfica, chamado de Docker Nativo.

Se você tem 8GB ou menos de memória RAM, recomendamos o uso do Docker Engine, pois a interface gráfica do Docker Desktop + a execução dos containers pode consumir praticamente a memória da máquina, caso contrário usar o Docker Desktop é mais prático.

Se você quiser saber mais detalhes sobre isto, veja nosso vídeo [https://www.youtube.com/watch?v=99dCerRKO6s](https://www.youtube.com/watch?v=99dCerRKO6s).

Se você estiver no Windows, use o WSL 2. Veja nosso tutorial [https://github.com/codeedu/wsl2-docker-quickstart](https://github.com/codeedu/wsl2-docker-quickstart).

## Rodar a aplicação

Rode a aplicação:

```bash
npm install
```

```
npx nodemon
```

Use o arquivo `api.http` para testar a API. Você pode usar a extensão REST Client no VSCode para fazer isso.


## Requisitos do sistema

Leia o arquivo [requisitos-sistema.md](./requisitos-sistema.md) para entender o escopo do sistema.

## Links e material adicional

* Como montar o melhor ambiente Dev no Windows, Linux e Mac com WSL [https://www.youtube.com/watch?v=O33trWxqVC4](https://www.youtube.com/watch?v=O33trWxqVC4)
* Instalação do Node.js [https://nodejs.org/](https://nodejs.org/)
* MySQL Workbench [https://www.mysql.com/products/workbench/](https://www.mysql.com/products/workbench/)
* Docker [https://www.docker.com/](https://www.docker.com/)
* Tutorial do WSL + Docker [https://github.com/codeedu/wsl2-docker-quickstart]
* Minhas configurações do VSCode [https://github.com/argentinaluiz/my-vscode-settings](https://github.com/argentinaluiz/my-vscode-settings)

## Sugestão de livros

* [Clean Code](https://www.amazon.com.br/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
* [Clean Architecture](https://www.amazon.com.br/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
* [Patterns of Enterprise Application Architecture](https://www.amazon.com.br/Patterns-Enterprise-Application-Architecture-Martin/dp/0321127420)