using System.ComponentModel.DataAnnotations;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public long Id { get; set; }

        public string NomeBeneFiciario { get; set; }

        [MaxLength(14)]
        public string CPFBeneficiario { get; set; }

        public long IdCliente { get; set; }
    }
}