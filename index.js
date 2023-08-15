
const express = require('express');
const app = express();
const fs = require('fs/promises');
const PORT = 3000;

//http://localhost:3000
app.get("/", async (req, res) => {
    try {
        const animeRaiz = JSON.parse(await (fs.readFile(__dirname + '/anime.json')));
        res.status(200).json(animeRaiz);
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'ERROR AL LEER EL ARCHIVO',
            message_system: error.message
        });
    }
});

//http://localhost:3000/read/1
app.get("/read/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const animeRaiz = JSON.parse(await (fs.readFile(__dirname + '/anime.json')));
        const anime = animeRaiz[id];
        if (anime) {
            res.status(200).json(anime);
        } else {
            res.status(404).json({
                status: 'OK',
                message: `NO EXISTE ID ${id}`
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'ERROR AL LEER EL ARCHIVO',
            message_system: error.message
        });
    }
});

//http://localhost:3000/create?nombre=Candy&genero=Anime&anio=1985&autor=Desconocido
app.get("/create/", async (req, res) => {
    try {
        const nombre = req.query.nombre;
        const genero = req.query.genero;
        const anio = req.query.anio;
        const autor = req.query.autor;
        const anime = {
            nombre,
            genero,
            anio,
            autor
        }
        const animeRaiz = JSON.parse(await (fs.readFile(__dirname + '/anime.json')));
        const id = new String(Number(Object.keys(animeRaiz)[Object.keys(animeRaiz).length - 1]) + 1);

        if (nombre && genero && anio && autor) {
            animeRaiz[id] = anime;
            await fs.writeFile(__dirname + '/anime.json', JSON.stringify(animeRaiz));
            res.status(201).json(animeRaiz);
        } else {
            res.status(400).json({
                message: `PARAMETROS INCOMPLETOS PARA CREAR ANIME`
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'ERROR AL CREAR EN ARCHIVO',
            message_system: error.message
        });
    }
});

//http://localhost:3000/update/1?nombre=Candy&genero=Anime&anio=1989&autor=Desconocido
app.get("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const nombre = req.query.nombre;
        const genero = req.query.genero;
        const anio = req.query.anio;
        const autor = req.query.autor;
        let encontrado = false;

        if (nombre && genero && anio && autor) {
            const animeRaiz = JSON.parse(await (fs.readFile(__dirname + '/anime.json')));
            const anime = animeRaiz[id];
            if (anime) {
                anime.nombre = nombre;
                anime.genero = genero;
                anime.anio = anio;
                anime.autor = autor;
                encontrado = true;
            }

            if (encontrado) {
                await fs.writeFile(__dirname + '/anime.json', JSON.stringify(animeRaiz));
                res.status(201).json(animeRaiz);
            } else {
                res.status(404).json({
                    status: 'OK',
                    message: `ID ${id} NO ENCONTRADO`
                });
            }
        } else {
            res.status(400).json({
                message: `PARAMETROS INCOMPLETOS PARA ACTUALIZAR ANIME`
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'ERROR AL ACTUALIZAR EL ARCHIVO',
            message_system: error.message
        });
    }
});

//http://localhost:3000/delete/1
app.get("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const animeRaiz = JSON.parse(await (fs.readFile(__dirname + '/anime.json')));
        const anime = animeRaiz[id];
        if (anime) {
            delete animeRaiz[id];
            await fs.writeFile(__dirname + '/anime.json', JSON.stringify(animeRaiz));
            res.status(201).json(animeRaiz);
        } else {
            res.status(404).json({
                status: 'OK',
                message: `NO EXISTE ID ${id}`
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'ERROR AL BORRAR EN ARCHIVO',
            message_system: error.message
        });
    }
});

app.listen(PORT, () => console.log(`Iniciando en puerto ${PORT}`));

module.exports = {
    app
};