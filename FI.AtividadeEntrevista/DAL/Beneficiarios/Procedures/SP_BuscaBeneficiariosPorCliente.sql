CREATE PROCEDURE SP_BuscaBeneficiariosPorCliente
    @IDCLIENTE INT
AS
BEGIN
    SELECT 
        ID, 
        CPF, 
        NOME,
		IDCLIENTE
    FROM 
        BENEFICIARIOS
    WHERE 
        IDCLIENTE = @IDCLIENTE;
END