
#  Descrição do Projeto
Você pegará uma instalação de referência de um servidor Linux e a preparará para hospedar suas aplicações web. Também irá oferecer segurança a seu servidor contra um número de vetores de ataque, instalar e configurar um servidor de banco de dados e implantar uma de suas aplicações web existentes a ele.

IP Público: 52.72.134.132

Porta SSH: 2200

URL: http://ec2-52-72-134-132.compute-1.amazonaws.com


![Acesso](https://github.com/WallysonGalvao/nanodegree/blob/master/p6-server-config/SNAG-0114.png)

## Gerenciamento de usuários

### Dê acesso a grader

1. Crie uma nova conta de usuário com o nome grader:

```
ubuntu:~$ sudo adduser grader
```
2. Dê ao usuário grader as permissões de sudo:

- Crie um novo arquivo no diretório sudoers 

```
ubuntu:~$ sudo nano /etc/sudoers.d/grader
```

- Adicione o seguinte texto

```
ubuntu:~$ grader ALL=(ALL:ALL) ALL
```


3. Crie um par de chaves SSH para grader usando a ferramenta ssh-keygen.

- Gerando par de chave na sua máquina local
```
LOCAL_MACHINE:~$ ssh-keygen
```

- Escolhendo o diretório e o nome da chave, aqui também é possível escolher uma passphrase (não é obrigatório) 
```
LOCAL_MACHINE:~$ ~/.ssh/grader
```

- Criando um diretório .ssh
> Obs: Os seguintes passos serão feitos na máquina da Amazon
```
grader:~$ mkdir .ssh
```
- Criando um arquivo authorized_keys 
```
grader:~$ touch .ssh/authorized_keys
```
- Editando o arquivo authorized_keys 
```
grader:~$ nano .ssh/authorized_keys
```

- Copie e cole a chave gerada na sua máquina local (grader.pub) para dentro do arquivo authorized_keys

- Configure as permissões para o arquivo 
```
grader:~$ sudo chmod 700 .ssh
grader:~$ sudo chmod 664 .ssh/authorized_keys
```
> - Faça login usando o par de chaves gerados 
```
LOCAL_MACHINE:~$ ssh grader@<IP_PUBLICO> -i ~/.ssh/grader
```

## Segurança

### Dê segurança a seu servidor

1. Atualize todos os pacotes instalados:

- Atualizando a lista de pacotes disponíveis 
```
grader:~$ sudo apt-get update
```
- Fazendo o upgrade dos pacotes instalados 
```
grader:~$ sudo apt-get upgrade
```

2. Mude a porta SSH de 22 para 2200. Certifique-se de configurar o Firewall Lightsail para permitir isso:

No site da [Amazon Lightsail](https://lightsail.aws.amazon.com/ls/webapp/home/instances), acesse os detalhes da sua instância e vá na aba "Redes", nas opções do Firewall clique em "+ Adicionar outro", então crie uma nova porta personalizada com os valores:

> - Aplicativo: Personalizado
> - Protocolo: TCP
> - Intervalo de portass: 2200 

- Altere porta SSH de 22 para 2200 e desative o login remoto do usuário root
```
grader:~$ sudo nano /etc/ssh/sshd_config
```

> - Mude a linha 'Port 22' para 'Porta 2200', e salve o arquivo
> - Mude PermitRootLogin para 'no' , e salve o arquivo
> - Restarte o serviço SSH
```
grader:~$ sudo service ssh restart
```

- Confirme as mudanças
```
LOCAL_MACHINE:~$ ssh grader@<IP_PUBLICO> -p 2200 -i ~/.ssh/grader
```

3. Configure o Uncomplicated Firewall (UFW) para permitir apenas conexões de entrada para SSH (porta 2200), HTTP (porta 80) e NTP (porta 123).
``` 
grader:~$ sudo ufw allow 2200/tcp
grader:~$ sudo ufw allow 80/tcp
grader:~$ sudo ufw allow 123/udp
grader:~$ sudo ufw enable
```


## Funcionalidade da aplicação

### Prepare-se para implementar seu projeto
1. Configure o fuso horário local para UTC.

- Execute e então escolha o UTC
```
grader:~$ sudo dpkg-reconfigure tzdata
``` 

2. Instale e configure o Apache para servir uma aplicação mod_wsgi Python.
- Instalando o Apache 
```
grader:~$ sudo apt-get install apache2
```
> Se o apache foi configurado corretamente, uma página de boas vindas aparecerá quando você usar o IP público: **http://ec<IP_PUBLICO>.compute-1.amazonaws.com/**

3. Instale e configure o mod_wsgi:
- Instalando mod_wsgi
```
grader:~$ sudo apt-get install libapache2-mod-wsgi python-dev
```

- Se você construiu seu projeto com Python 3, precisará instalar o pacote Python 3 mod_wsgi em seu servidor
```
grader:~$ sudo apt-get install libapache2-mod-wsgi-py3 python-dev
```

- ativE o mod_wsgi se ele não estiver ativado
```
grader:~$ sudo a2enmod wsgi
```

4. Configure o Apache para servir o aplicativo da web usando o WSGI

- Crie o arquivo WSGI do aplicativo da web

```
grader:~$ sudo nano /var/www/itemsCatalog/vagrant/catalog/itemsCatalog.wsgi
```

```
#!/usr/bin/python
import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/var/www/itemsCatalog/vagrant/catalog')

from application import app as application
application.secret_key='super_secret_key'
```

- Configure e ative um novo host virtual

```
grader:~$ sudo nano /etc/apache2/sites-available/itemsCatalog.conf
```

- Cole este código

```
<VirtualHost *:80>
     ServerName 52.72.134.132
     ServerAlias ec2-52-72-134-132.us-west-2.compute.amazonaws.com
     ServerAdmin admin@52.72.134.132
     #Location of the items-catalog WSGI file
     WSGIScriptAlias / /var/www/itemsCatalog/vagrant/catalog/itemsCatalog.wsgi
     #Allow Apache to serve the WSGI app from our catalog directory
     <Directory /var/www/itemsCatalog/vagrant/catalog>
          Order allow,deny
          Allow from all
     </Directory>
     #Allow Apache to deploy static content
     Alias /static /var/www/itemsCatalog/vagrant/catalog/static
     <Directory /var/www/itemsCatalog/vagrant/catalog/static>
        Order allow,deny
        Allow from all
     </Directory>
      ErrorLog ${APACHE_LOG_DIR}/error.log
      LogLevel warn
      CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

- Você precisa, então, configurar o Apache para lidar com requisições usando o módulo WSGI. Você fará isso editando o arquivo 

```
grader:~$ sudo nano /etc/apache2/sites-enabled/000-default.conf
```

- Por agora, adicione a seguinte linha ao final do bloco <VirtualHost *:80>, logo antes de fechar a linha ```</VirtualHost>```: 

```
WSGIScriptAlias / /var/www/itemsCatalog/vagrant/catalog/itemsCatalog.wsgi
```

Por fim, reinicie o Apache com o comando 

```
grader:~$ sudo apache2ctl restart
```

5. Instale o GIT:

```
grader:~$ sudo apt-get install git
```

- Navegue até o diretório itemsCatalog

```
cd /var/www/itemsCatalog
```

- Clone o projeto

```
grader:~$ sudo git clone https://github.com/harushimo/fullstack-nanodegree-vm.git  itemsCatalog
```

6. Instale o Flask

```
grader:~$ sudo apt-get install python-pip python-flask python-sqlalchemy python-psycopg2
grader:~$ sudo pip install oauth2client requests httplib2
```

7. Instale e configure o PostgreSQL:

- Instalando PostgreSQL 

```
grader:~$ sudo apt-get install postgresql
```

- Crie o banco de dados

```
grader:~$ sudo -u postgres -i
```

- Execute os seguintes comandos

```
postgres=# CREATE USER catalog WITH PASSWORD 'catalog';
postgres=# ALTER USER catalog CREATEDB;
postgres=# CREATE DATABASE catalog WITH OWNER catalog;
```

- Conecte-se ao banco de dados do catálogo

```
\c catalog
```

- Execute os seguintes comandos

```
catalog=# REVOKE ALL ON SCHEMA public FROM public;
catalog=# GRANT ALL ON SCHEMA public TO catalog;
```

8. Últimas configurações no projeto

- Precisamos atualizar nossos arquivos python de configuração e aplicação de banco de dados para a nova conexão

> Nos arquivos application.py e database_setup.py, substitua

```
engine = create_engine('postgresql://sports:sports@localhost/sportsvenue')
```

por 

```
engine = create_engine('postgresql://catalog:catalog@localhost/catalog')
```

Ainda no arquivo application.py, também substitua

```
CLIENT_ID = json.loads(
    open('client_secrets.json', 'r').read())['web']['client_id']
```

por

```
CLIENT_ID = json.loads(
    open('/var/www/itemsCatalog/vagrant/catalog/client_secrets.json', 'r').read())['web']['client_id']
```

e 

```
oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
```

por 

```
oauth_flow = flow_from_clientsecrets('/var/www/itemsCatalog/vagrant/catalog/client_secrets.json', scope='')
```

Por fim acesse: http://ec2-52-72-134-132.compute-1.amazonaws.com


