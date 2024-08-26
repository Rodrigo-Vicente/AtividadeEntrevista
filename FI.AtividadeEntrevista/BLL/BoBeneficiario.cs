using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public bool VerificarExistencia(string cpf)
        {
            DAL.DaoBeneficiarios bene = new DAL.DaoBeneficiarios();
            return bene.VerificarExistencia(cpf);
        }
        public long Incluir(List<BENEFICIARIOS> beneficiario)
        {
            DAL.DaoBeneficiarios bene = new DAL.DaoBeneficiarios();
            return bene.Incluir(beneficiario);
        }

        public void Alterar(BENEFICIARIOS beneficiario)
        {
            DAL.DaoBeneficiarios bene = new DAL.DaoBeneficiarios();
            bene.Alterar(beneficiario);
        }

        public List<BENEFICIARIOS> Consultar(long id)
        {
            DAL.DaoBeneficiarios bene = new DAL.DaoBeneficiarios();
            return bene.Consultar(id);
        }

        public void Excluir(long id)
        {
            DAL.DaoBeneficiarios bene = new DAL.DaoBeneficiarios();
            bene.Excluir(id);
        }
    }
}
