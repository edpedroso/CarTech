(function($) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  var app = (function application(){
    var $erro = new $('[data-js="erro"]');
    var $dadosCarro = new $('input');

    return {
      init: function init(){
        this.dadosEmpresa();
        this.iniciaEventos();
      },

      iniciaEventos: function iniciaEventos(){
        $('[data-js="submit"]').get(0).addEventListener('click', this.handleBtnClick, false);
      },

      handleBtnClick: function handleBtnClick(event){
        event.preventDefault();
        app.escondeErro();
        if(app.checaDadosCarro()){
          app.setNewCarro();
        }else{
          app.msgErro('Preencha todos os campos do Veículo!', 'danger');
        }
      },

      setNewCarro: function setNewCarro(){
        var $tabelaCarros = new $('[data-js="tabelaCarros"]');
        var tableRow = document.createElement('tr');
        var idExcluir;
        Array.prototype.forEach.call($dadosCarro.get(), function(item){
          var tableData = null;
          tableData = document.createElement('td');
          if(item.getAttribute('type') !== 'url'){
            tableData.appendChild(document.createTextNode(item.value));
          }else{
            var img = document.createElement('img');
            img.src = item.value;
            img.width = 200;
            tableData.appendChild(img);
          }
          tableRow.appendChild(tableData);
          item.value = '';
        });
        idExcluir = new Date().getTime();
        tableRow.appendChild(app.insereBtnExcluir(idExcluir));
        $tabelaCarros.get(0).appendChild(tableRow);

        app.acaoBtnExcluir(idExcluir);
      },

      acaoBtnExcluir: function acaoBtnExcluir(idExcluir){
        var $btnExcluir = new $('[data-js="' + idExcluir + '"]');
        $btnExcluir.on('click', function(){
          this.parentNode.parentNode.remove();
        }, false);
      },

      insereBtnExcluir: function insereBtnExcluir(idExcluir){
        var tdExcluir = document.createElement('td');
        var btnExcluir = document.createElement('button');
        btnExcluir.setAttribute('data-js', idExcluir);
        btnExcluir.setAttribute('class', 'btn btn-danger btn-block');
        btnExcluir.appendChild(document.createTextNode('EXCLUIR'));
        tdExcluir.appendChild(btnExcluir);
        return tdExcluir;
      },

      checaDadosCarro: function checaDadosCarro(){
        return Array.prototype.every.call($dadosCarro.get(), function(item){
          return item.value !== '';
        })
      },

      msgErro: function msgErro(msg, tipo = 'danger'){
        $erro.get(0).textContent = msg;
        this.removeClasseStyleErro();
        $erro.get(0).classList.add('alert-' + tipo);
        this.mostraErro();
      },

      removeClasseStyleErro: function removeClasseStyleErro(){
        var classeRemover = Array.prototype.find.call($erro.get(0).classList, function(item){
          var regex = /alert-(?:\w)+/g;
          return regex.test(item);
        });
        $erro.get(0).classList.remove(classeRemover);
      },

      mostraErro: function mostraErro(){
          $erro.get(0).classList.remove('d-none');
      },

      escondeErro: function escondeErro(){
          $erro.get(0).classList.add('d-none');
      },

      dadosEmpresa: function dadosEmpresa(){
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getDadosEmpresa, false);
      },

      getDadosEmpresa: function getDadosEmpresa(){
        if(this.readyState === 4 && this.status === 200){
          var textCompany = JSON.parse(this.responseText);
          var $nomeEmpresa = $('[data-js="nomeEmpresa"]');
          var $foneEmpresa = $('[data-js="foneEmpresa"]');
          $nomeEmpresa.get(0).textContent = textCompany.name;
          $foneEmpresa.get(0).textContent = textCompany.phone;
        }
      }
    };


  })();

  app.init();

})(window.DOM);
