using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using System.Linq;
using System.Text.RegularExpressions;

public static class Funcoes
{
    public static bool CPFvalido(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return false;

        // Remove pontuações
        cpf = Regex.Replace(cpf, @"[^0-9]", "");

        // Verifica se o CPF tem 11 dígitos
        if (cpf.Length != 11)
            return false;

        // Verifica se todos os dígitos são iguais
        if (new string(cpf[0], 11) == cpf)
            return false;

        // Calcula o primeiro dígito verificador
        int[] cpfDigits = cpf.Select(c => int.Parse(c.ToString())).ToArray();
        int sum = 0;
        for (int i = 0; i < 9; i++)
            sum += cpfDigits[i] * (10 - i);

        int firstDigit = (sum * 10) % 11;
        if (firstDigit == 10 || firstDigit == 11)
            firstDigit = 0;

        if (cpfDigits[9] != firstDigit)
            return false;

        // Calcula o segundo dígito verificador
        sum = 0;
        for (int i = 0; i < 10; i++)
            sum += cpfDigits[i] * (11 - i);

        int secondDigit = (sum * 10) % 11;
        if (secondDigit == 10 || secondDigit == 11)
            secondDigit = 0;

        return cpfDigits[10] == secondDigit;
    }

    public static bool ClienteDuplicado(string cpf, long id)
    {
        BoCliente bo = new BoCliente();
        Cliente cliente = bo.Consultar(id);

        if(cliente.CPF != cpf)
        {
            return bo.VerificarExistencia(cpf);
        }
        else
        {
            return false;
        }
    }
    public static string FormatarCPF(string cpf)
    {
        if (string.IsNullOrEmpty(cpf))
            return cpf;

        cpf = cpf.Replace(".", "").Replace("-", "").Replace(" ", "");

        return cpf.Length == 11
            ? $"{cpf.Substring(0, 3)}.{cpf.Substring(3, 3)}.{cpf.Substring(6, 3)}-{cpf.Substring(9, 2)}"
            : cpf;
    }

    public static string RemoverMascaraCPF(string cpfComMascara)
    {
        return new string(cpfComMascara.Where(char.IsDigit).ToArray());
    }
}