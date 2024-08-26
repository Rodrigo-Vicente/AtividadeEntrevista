using System.Collections.Generic;
using System.Data;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiarios : AcessoDados
    {
        internal long Incluir(List<DML.BENEFICIARIOS> beneficiarios)
        {
            long ultimoIdInserido = 0;

            foreach (var beneficiario in beneficiarios)
            {
                List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF),
                new System.Data.SqlClient.SqlParameter("NOME", beneficiario.NOME),
                new System.Data.SqlClient.SqlParameter("IDCLIENTE", beneficiario.IDCLIENTE)
             };

                DataSet ds = base.Consultar("SP_InsereBeneficiario", parametros);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out long idInserido);
                    ultimoIdInserido = idInserido; 
                }
            }

            return ultimoIdInserido;
        }

        internal void Alterar(DML.BENEFICIARIOS beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("NOME", beneficiario.NOME));
            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", beneficiario.ID));

            base.Executar("SP_AtualizaBeneficiario", parametros);
        }

        internal void Excluir(long Id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", Id));

            base.Executar("SP_ExcluiBeneficiario", parametros);
        }

        internal List<DML.BENEFICIARIOS> Consultar(long Id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("IDCLIENTE", Id));

            DataSet ds = base.Consultar("SP_BuscaBeneficiariosPorCliente", parametros);
            List<DML.BENEFICIARIOS> bene = Converter(ds);

            return bene;
        }

        internal bool VerificarExistencia(string CPF)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", CPF));

            DataSet ds = base.Consultar("SP_BuscaBeneficiariosPorCPF", parametros);

            return ds.Tables[0].Rows.Count > 0;
        }

        private List<DML.BENEFICIARIOS> Converter(DataSet ds)
        {
            List<DML.BENEFICIARIOS> lista = new List<DML.BENEFICIARIOS>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.BENEFICIARIOS bene = new DML.BENEFICIARIOS();
                    bene.ID = row.Field<long>("ID");
                    bene.CPF = row.Field<string>("CPF");
                    bene.NOME = row.Field<string>("NOME");
                    bene.IDCLIENTE = row.Field<long>("IDCLIENTE");
                    lista.Add(bene);
                }
            }

            return lista;
        }
    }
}
