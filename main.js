(function($) {
  'use strict';

  var app = (function application(){
    var $erro = new $('[data-js="erro"]');
    var $dadosCarro = new $('input');
    var tableRow;

    return {
      init: function init(){
        this.dadosEmpresa();
        this.carregaCarros();
        this.iniciaEventos();
      },

      carregaCarros: function carregaCarros(){
        var ajaxGet = new XMLHttpRequest();
        ajaxGet.open('GET', 'http://localhost:3000/car');
        ajaxGet.send();
        ajaxGet.addEventListener('readystatechange', this.listaCarros);
      },

      listaCarros: function listaCarros(){
        if(this.readyState === 4 && this.status === 200){
          var arrCarros = JSON.parse(this.responseText);
          var $tabelaCarros = new $('[data-js="tabelaCarros"]');
          $tabelaCarros.get(0).innerText = '';

          arrCarros.forEach(function(item){
            tableRow = document.createElement('tr');
            var tdImagem = document.createElement('td');
            var imgImagem = document.createElement('img');
            imgImagem.src = item.image;
            imgImagem.width = 200;
            tdImagem.appendChild(imgImagem);
            tableRow.appendChild(tdImagem);

            app.montaLinhaTabela(item.brandModel);
            app.montaLinhaTabela(item.year);
            app.montaLinhaTabela(item.plate);
            app.montaLinhaTabela(item.color);

            tableRow.appendChild(app.insereBtnExcluir(item.plate));

            $tabelaCarros.get(0).appendChild(tableRow);

            app.acaoBtnExcluir(item.plate);
          });

        }
      },

      montaLinhaTabela: function montaLinhaTabela(dadoCarro){
        var td = document.createElement('td');
        var content = document.createTextNode(dadoCarro);
        td.appendChild(content);
        tableRow.appendChild(td);
      },


      iniciaEventos: function iniciaEventos(){
        $('[data-js="submit"]').get(0).addEventListener('click', this.handleBtnClick, false);
      },

      handleBtnClick: function handleBtnClick(event){
        event.preventDefault();
        app.escondeErro();
        if(app.checaDadosCarro()){
          app.cadastraCarro();
        }else{
          app.msgErro('Preencha todos os campos do Veículo!', 'danger');
        }
      },

      carroUrlEncoded: function carroUrlEncoded(){
        var carro = [];
        Array.prototype.forEach.call($dadosCarro.get(), function(item){
          carro.push(item.name + '=' + item.value);
        });
        return carro.join('&');
      },

      cadastraCarro: function cadastraCarro(){
        var ajaxPost = new XMLHttpRequest();
        ajaxPost.open('POST', 'http://localhost:3000/car');
        ajaxPost.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajaxPost.send(app.carroUrlEncoded());
        Array.prototype.forEach.call($dadosCarro.get(), function(item){
          item.value = '';
        });
        this.carregaCarros();
      },

      acaoBtnExcluir: function acaoBtnExcluir(idExcluir){
        var $btnExcluir = new $('[data-js="' + idExcluir + '"]');
        $btnExcluir.on('click', function(){
          var ajaxDel = new XMLHttpRequest();
          ajaxDel.open('DELETE', 'http://localhost:3000/car');
          ajaxDel.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          ajaxDel.send('plate=' + idExcluir);
          ajaxDel.onreadystatechange = function(){
            if(ajaxDel.readyState === 4 && ajaxDel.status === 200){
              app.carregaCarros();
            }
          };
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