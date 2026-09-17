import express from "express"
import pool from './db.js';

const app = express()
app.use(express.json())

app.post('/clientes', async (req,res) => {
    const { nome, email, } = req.body

    try{
        const resultado = await pool.query(`INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING*`, 
        [nome, email])

        return res.status(201).json(resultado.rows[0])
    } 
    
    catch(erro){
        return res.status(500).json({erro: "Erro ao cadastrar cliente."})
    }

})





app.get('/clientes', async (req,res) => {

    try{
        const resultado = await pool.query(`SELECT * FROM clientes`)

        return res.status(201).json(resultado.rows)
    } 
    
    catch(erro){
        return res.status(500).json({erro: "Erro ao cadastrar cliente."})
    }

})





app.put('/clientes/:id', async (req,res) => {
    const { nome, email } = req.body
    const id = Number(req.params.id)
    console.log(id)
    try{
        if (nome || email){
            const resultado = await pool.query(`UPDATE clientes SET nome = COALESCE($1, nome), email = COALESCE($2, email) where id = $3 RETURNING *`, [nome, email, id])
            return res.status(201).json(resultado.rows[0])
        }

    } 
    
    catch(erro){
        return res.status(500).json({erro: "Erro ao cadastrar cliente."})
    }

})





app.delete('/clientes/:id', async (req,res) => {
    const id = Number(req.params.id)
    console.log(id)
    try{
      const deletacao =  await pool.query(`DELETE FROM clientes WHERE id = $1`, [id])
      return res.status(201).json({sucesso: `ID ${id} deletado com sucesso`})

    } 
    catch(erro){
        return res.status(500).json({erro: "Erro ao cadastrar cliente."})
    }

})





app.post('/pedidos', async (req, res) => {
    const { produto, valor, status, cliente_id } = req.body
    
    try {
        const cliente = await pool.query(`SELECT id FROM clientes WHERE id = $1`, [cliente_id])
        
        if (cliente.rows.length === 0) {
            return res.status(404).json({ erro: "Cliente não encontrado." })
        }
        
        const resultado = await pool.query(
            `INSERT INTO pedidos (produto, valor, status, cliente_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [produto, valor, status, cliente_id]
            )
            
            return res.status(201).json(resultado.rows[0])
        }
        catch (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao cadastrar pedido." })
        }
    })
    
    
    
    
    
    app.get('/pedidos', async (req, res) => {
        try {
            const resultado = await pool.query(`
            SELECT pedidos.id, pedidos.produto, pedidos.valor, pedidos.status, clientes.nome, clientes.email
            FROM pedidos
            INNER JOIN clientes ON pedidos.cliente_id = clientes.id
            `)
            return res.status(200).json(resultado.rows)
        }
        catch (erro) {
            return res.status(500).json({ erro: "Erro ao buscar pedido." })
        }
    })




    app.delete('/pedidos/:id', async (req,res) => {
        const id = Number(req.params.id)
        console.log(id)
        try{
          const deletacao =  await pool.query(`DELETE FROM pedidos WHERE id = $1`, [id])
          return res.status(201).json({sucesso: `ID ${id} deletado com sucesso`})
    
        } 
        catch(erro){
            return res.status(500).json({erro: "Erro ao cadastrar cliente."})
        }
    
    })

    app.listen(3000, ()=>(console.log("Servidor rodando em http://localhost:3000")))