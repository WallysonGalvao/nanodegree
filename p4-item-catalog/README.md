# Catálogo de Itens
Aplicativo de menu de restaurante onde os usuários podem adicionar, editar e excluir restaurantes e itens de menu nos restaurantes.

## Configurando o projeto
### Pré-requisitos
* [Python 3](https://www.python.org/downloads/)
* [Vagrant](https://www.vagrantup.com/downloads.html)
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

### Executando
1. Instale o VirtualBox e o Vagrant
2. Clone este repositorio
3. Descompacte e coloque a pasta p4-item-catalog no seu diretório Vagrant
4. Execute o Vagrant
```
$ Vagrant up 
```
5. Logue no Vagrant
```
$ Vagrant ssh
```
6. Mude o diretório para `/vagrant`
```
$ Cd /vagrant
```
7. Inicialize o banco de dados
```
$ Python database_setup.py
```
8. Preencher o banco de dados com alguns dados iniciais
```
$ Python menus.py
```
9. Starte a aplicação 
```
$ Python project.py
```
10. Abra o navegador e vá para http://localhost:5000

### JSON endpoints
#### Retorna JSON de todos os restaurantes

```
/restaurants/JSON
```
#### Retorna JSON do item de menu específico

```
/restaurants/<int:restaurant_id>/menu/<int:menu_id>/JSON
```
#### Retorna JSON do menu

```
/restaurants/<int:restaurant_id>/menu/JSON
```
