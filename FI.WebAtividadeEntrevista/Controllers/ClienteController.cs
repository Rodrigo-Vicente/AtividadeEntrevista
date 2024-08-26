using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario bene = new BoBeneficiario();
            
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            if (bo.VerificarExistencia(model.CPF))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, "CPF duplicado!"));
            }

            if (!Funcoes.CPFvalido(model.CPF))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, "CPF Invalido!"));
            }
            else
            {
               var IdCliente = bo.Incluir(new Cliente()
               {
                   CEP = model.CEP,
                   Cidade = model.Cidade,
                   Email = model.Email,
                   Estado = model.Estado,
                   Logradouro = model.Logradouro,
                   Nacionalidade = model.Nacionalidade,
                   Nome = model.Nome,
                   Sobrenome = model.Sobrenome,
                   Telefone = model.Telefone,
                   CPF = Funcoes.RemoverMascaraCPF(model.CPF)
               });

                var valorId = IdCliente;

                if (model.Beneficiarios.Any())
                {

                    List<BeneficiarioModel> beneficiarios = model.Beneficiarios;
                    var ListarBeneficiarios = new List<BENEFICIARIOS>();

                    foreach (var beneficiario in beneficiarios)
                    {
                        BENEFICIARIOS beneficiarioNovo = new BENEFICIARIOS()
                        {
                            CPF = Funcoes.RemoverMascaraCPF(beneficiario.CPFBeneficiario),
                            NOME = beneficiario.NomeBeneFiciario,
                            IDCLIENTE = valorId
                        };
                        ListarBeneficiarios.Add(beneficiarioNovo);
                        
                    }
                    bene.Incluir(ListarBeneficiarios);
                }

                Response.StatusCode = 200;
                return Json(string.Join(Environment.NewLine, "Cadastro efetuado com sucesso"));
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            if (Funcoes.ClienteDuplicado( model.CPF,model.Id))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, "CPF duplicado!"));
            }
            if (!Funcoes.CPFvalido(model.CPF))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, "CPF Invalido!"));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = Funcoes.RemoverMascaraCPF(model.CPF)
                });

                return Json(string.Join(Environment.NewLine, "Cadastro alterado com sucesso"));
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = Funcoes.FormatarCPF(cliente.CPF),
                    Beneficiarios = cliente.Beneficiarios != null? cliente.Beneficiarios.Select(b => new BeneficiarioModel
                    {
                        Id = b.ID,
                        NomeBeneFiciario = b.NOME, 
                        CPFBeneficiario = Funcoes.FormatarCPF(b.CPF), 
                        IdCliente = b.IDCLIENTE 
                    }).ToList() : new List<BeneficiarioModel>()
                };

            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}