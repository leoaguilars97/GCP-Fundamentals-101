const sql_client = require('mysql')
const express = require('express')
const app = express()
const cors = require('cors')

const client = sql_client.createConnection({
    database: 'imagenes',
    host: "34.134.150.172",
    port: 3306,
    user: "yo",
    password: "leoleoleo" //abcd1234
})

client.connect(err => console.log(err || `> Connection stablished`))

const create = ({ table, schema }, res) => {
    const s = schema.map(v => `${v.name} ${v.type}`)
    const sql = `CREATE TABLE ${table} (${s.join(',')})`
    console.log(`> Executing ${sql}`)
    client.query(sql, (err, r) => {
        if (err){
            console.log(`! Error creating table ${table}`)
            console.log(err)
            return res.json(err).status(500)
        }

        console.log(`> Success creating table ${table}`)
        console.log(r)
        
        res.json(r)
    })
}

const insert = ({ table, names, values }, res) => {
    const n = names.join(', ')
    const v = values.map(v => `'${v}'`).join(', ')
    const sql = `INSERT INTO ${table} (${n}) VALUES (${v})`
    console.log(`> Executing ${sql}`)
    client.query(sql, values, (err, r) => {
        if (err){
            console.log(`! Error inserting to table ${table}`)
            console.log(err)
            return res.json(err).status(500)
        }

        console.log(`> Success inserting to table ${table}`)
        console.log(r)
        
        res.json(r)
    })
}

const get = ({ table }, res) => {
    const sql = `SELECT * FROM ${table}`
    console.log(`> Executing ${sql}`)
    
    client.query(sql, (err, r) => {
        if (err){
            console.log(`! Error fetching table ${table}`)
            console.log(err)
            return res.json(err).status(500)
        }

        console.log(`> Success fetching table ${table}`)
        console.table(r)
        
        res.json(r)
    })
}

app.use(express.json({ limit: '15mb', extended: true }))
app.use(cors({ origin: true, optionsSuccessStatus: 200 }))
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', ['GET, POST'])
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

app.get('/table/:table', ({ params }, res) => get(params, res))
app.post('/create', ({ body }, res) => create(body, res))
app.post('/insert', ({ body}, res) => insert(body, res))

const port = process.env.PORT || 3000
app.listen(port, console.log(`API @ ${port}`))



