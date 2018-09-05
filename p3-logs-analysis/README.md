# Análise de logs

## Visão geral do projeto
Ferramenta interna de relatórios (internal reporting tool) que usará informações do banco de dados para descobrir de que tipo de artigos os leitores do site gostam.

# Configurando a aplicação

**Obs:** Partindo do princípio que você já tenha o Vagrant configurado em sua máquina, caso não tenha configure utilizando o seguinte [link](https://classroom.udacity.com/nanodegrees/nd004-br/parts/65532ab5-909e-486a-8a90-460abd50e695/modules/bc51d967-cb21-46f4-90ea-caf73439dc59/lessons/5475ecd6-cfdb-4418-85a2-f2583074c08d/concepts/14c72fe3-e3fe-4959-9c4b-467cf5b7c3a0).


Com o Vagrant já instaldo:
### Criando o banco:
> 1) Você precisará descompactar este [arquivo](https://d17h27t6h515a5.cloudfront.net/topher/2016/August/57b5f748_newsdata/newsdata.zip) após o download. O arquivo dentro é chamado de newsdata.sql. Coloque este arquivo no diretório **/vagrant** que é compartilhado com a máquina virtual. Para criar a ferramenta de relatórios, você precisará carregar esses arquivos no seu banco de dados local.
> 3) Para carregar os dados, use o comando:
```
    $ psql -d news -f newsdata.sql
```
### Executando a aplicação:
> 1) Dentro do terminal do sistema operacional, navegue para a pasta raiz do projeto **/vagrant**.
> 3) Dentro da pasta raiz do projeto  execute o seguinte código:
```
    $ python newsdata.py
```

## Requisitos

* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* [Vagrant](https://www.vagrantup.com/downloads.html)
* [Python](https://www.python.org/downloads/)

