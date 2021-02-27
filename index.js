const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
csv = require('csvtojson');

dotenv.config();

// MIDDLEWARE HANDLE CORSS
app.use(cors());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Method',
		'GET',
		'POST',
		'PATCH',
		'DELETE',
		'OPTIONS',
	);
	res.header(
		'Access-Control-Allow-Header',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

const newName = (name) => {
	const split = name.split(' ');
	const result = split.slice(1).join(' ');
	return result;
};

const CapitalizeEachWord = (text) => {
	const words = text.toLowerCase().split(' ');
	const res = words
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(' ');
	return res;
};

app.get('/provinsi', async (req, res) => {
	const read = await csv().fromFile('./csv/provinsi.csv');

	const response = read.map((prov) => ({
		id: prov['11'],
		name: CapitalizeEachWord(prov['ACEH']),
	}));

	const findbyId = response.filter((el) => el.id === req.query.id);

	if (req.query.id) res.status(200).json(...findbyId);

	res.status(200).json(response);
});

app.get('/kabupaten', async (req, res) => {
	const read = await csv().fromFile('./csv/kabupaten.csv');

	const response = read.map((kab) => ({
		id: kab['1101'],
		prov_id: kab['11'],
		name: CapitalizeEachWord(newName(kab['KABUPATEN SIMEULUE'])),
	}));

	const findbyId = response.filter(
		(el) => el.prov_id === req.query.id_kabupaten,
	);

	if (req.query.id_kabupaten) res.status(200).json(findbyId);

	res.status(200).json(response);
});

app.get('/kecamatan', async (req, res) => {
	const read = await csv().fromFile('./csv/kecamatan.csv');
	const response = read.map((kec) => ({
		id: kec['1101010'],
		kab_id: kec['1101'],
		name: CapitalizeEachWord(kec['TEUPAH SELATAN']),
	}));
	const findbyId = response.filter(
		(el) => el.kab_id === req.query.id_kecamatan,
	);
	if (req.query.id_kecamatan) res.status(200).json(findbyId);
	res.status(200).json(response);
});

app.get('/kelurahan', async (req, res) => {
	const read = await csv().fromFile('./csv/kelurahan.csv');
	const response = read.map((kel) => ({
		id: kel['1101010001'],
		kec_id: kel['1101010'],
		name: CapitalizeEachWord(kel['LATIUNG']),
	}));
	const findbyId = response.filter(
		(el) => el.kec_id === req.query.id_kelurahan,
	);
	if (req.query.id_kelurahan) res.status(200).json(findbyId);

	res.status(200).json(response);
});

app.listen(process.env.PORT || 4000, () =>
	console.log('server running on port 4000'),
);
