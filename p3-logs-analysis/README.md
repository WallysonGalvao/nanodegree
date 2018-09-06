# Análise de logs

## Visão do projeto
Ferramenta interna de relatórios (internal reporting tool) que usará informações do banco de dados para descobrir de que tipo de artigos os leitores do site gostam.

A ferramenta produz respostas para as três perguntas a seguir com base nos dados do banco de dados:

1. Quais são os três artigos mais populares de todos os tempos?
2. Quem são os autores de artigos mais populares de todos os tempos?
3. Em quais dias mais de 1% das requisições resultaram em erros?

## Configurando a aplicação

### Requisitos

* Para instalar o VirtualBox - clique [aqui](https://www.virtualbox.org/wiki/Downloads)
* Para instalar o Vagrant - clique [aqui](https://www.vagrantup.com/downloads.html)
* Para instalar o Python - clique [aqui](https://www.python.org/downloads/)

### Instalando

**Obs:** Para mais informações de como instalar os requisitos acima utilize o seguinte [link](https://classroom.udacity.com/nanodegrees/nd004-br/parts/65532ab5-909e-486a-8a90-460abd50e695/modules/bc51d967-cb21-46f4-90ea-caf73439dc59/lessons/5475ecd6-cfdb-4418-85a2-f2583074c08d/concepts/14c72fe3-e3fe-4959-9c4b-467cf5b7c3a0).

### Executando o Vagrant

1) Rode o Vagrant executando o comando:
```
    $ vagrant up
```
2) Em seguida você deve logar via SSH, usando o comando:
```
    $ vagrant ssh
```

### Criando o banco:

> 1) Você precisará descompactar este [arquivo](https://d17h27t6h515a5.cloudfront.net/topher/2016/August/57b5f748_newsdata/newsdata.zip) após o download. O arquivo dentro é chamado de newsdata.sql. Coloque este arquivo no diretório **/vagrant** que é compartilhado com a máquina virtual. Para criar a ferramenta de relatórios, você precisará carregar esses arquivos no seu banco de dados local.
> 2) Para carregar os dados, use o comando:
```
    $ psql -d news -f newsdata.sql
```

O banco de dados inclui três tabelas:

* Authors
* Articles 
* Log  

### Executando a aplicação:
> 1) Dentro do terminal do sistema operacional, navegue para a pasta raiz do projeto **/vagrant**.
> 2) Dentro da pasta raiz do projeto  execute o seguinte código:
```
    $ python newsdata.py
```