var fs = require("fs");
var content = fs.readFileSync("custom.geo.json", "utf8");
var jsonContent = JSON.parse(content);

const polygonCountries = jsonContent.features
    .map((feature) => {
        if(feature.geometry.type === "Polygon") {
            return feature.geometry.coordinates;
        }
        return [];
    });

const multiPolygon = jsonContent.features.reduce((accumulator, feature) => {
    if(feature.geometry.type === "MultiPolygon") {
        const result = accumulator.slice();
        feature.geometry.coordinates.forEach((coordinate) => {
            result.push(coordinate);
        });
        return result;
    }
    return accumulator;
}, []);

const allPolygons = multiPolygon.concat(polygonCountries).filter((feature) => {
    return feature.length;
});

const mapJson =  {
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },
    "features": [
        {
            "type": "Feature",
            "properties": {
                "featurecla": "Admin-0 country",
                "scalerank": 5,
                "LABELRANK": 2,
                "SOVEREIGNT": "Indonesia",
                "SOV_A3": "IDN",
                "ADM0_DIF": 0,
                "LEVEL": 2,
                "TYPE": "Sovereign country",
                "ADMIN": "Indonesia",
                "ADM0_A3": "IDN",
                "GEOU_DIF": 0,
                "GEOUNIT": "Indonesia",
                "GU_A3": "IDN",
                "SU_DIF": 0,
                "SUBUNIT": "Indonesia",
                "SU_A3": "IDN",
                "BRK_DIFF": 0,
                "NAME": "Indonesia",
                "NAME_LONG": "Indonesia",
                "BRK_A3": "IDN",
                "BRK_NAME": "Indonesia",
                "BRK_GROUP": null,
                "ABBREV": "Indo.",
                "POSTAL": "INDO",
                "FORMAL_EN": "Republic of Indonesia",
                "FORMAL_FR": null,
                "NAME_CIAWF": "Indonesia",
                "NOTE_ADM0": null,
                "NOTE_BRK": null,
                "NAME_SORT": "Indonesia",
                "NAME_ALT": null,
                "MAPCOLOR7": 6,
                "MAPCOLOR8": 6,
                "MAPCOLOR9": 6,
                "MAPCOLOR13": 11,
                "POP_EST": 260580739,
                "POP_RANK": 17,
                "GDP_MD_EST": 3028000,
                "POP_YEAR": 2017,
                "LASTCENSUS": 2010,
                "GDP_YEAR": 2016,
                "ECONOMY": "4. Emerging region: MIKT",
                "INCOME_GRP": "4. Lower middle income",
                "WIKIPEDIA": -99,
                "FIPS_10_": "ID",
                "ISO_A2": "ID",
                "ISO_A3": "IDN",
                "ISO_A3_EH": "IDN",
                "ISO_N3": "360",
                "UN_A3": "360",
                "WB_A2": "ID",
                "WB_A3": "IDN",
                "WOE_ID": 23424846,
                "WOE_ID_EH": 23424846,
                "WOE_NOTE": "Exact WOE match as country",
                "ADM0_A3_IS": "IDN",
                "ADM0_A3_US": "IDN",
                "ADM0_A3_UN": -99,
                "ADM0_A3_WB": -99,
                "CONTINENT": "Asia",
                "REGION_UN": "Asia",
                "SUBREGION": "South-Eastern Asia",
                "REGION_WB": "East Asia & Pacific",
                "NAME_LEN": 9,
                "LONG_LEN": 9,
                "ABBREV_LEN": 5,
                "TINY": -99,
                "HOMEPART": 1,
                "MIN_ZOOM": 0,
                "MIN_LABEL": 1.7,
                "MAX_LABEL": 6.7,
                "NE_ID": 1159320845,
                "WIKIDATAID": "Q252",
                "NAME_AR": "إندونيسيا",
                "NAME_BN": "ইন্দোনেশিয়া",
                "NAME_DE": "Indonesien",
                "NAME_EN": "Indonesia",
                "NAME_ES": "Indonesia",
                "NAME_FR": "Indonésie",
                "NAME_EL": "Ινδονησία",
                "NAME_HI": "इंडोनेशिया",
                "NAME_HU": "Indonézia",
                "NAME_ID": "Indonesia",
                "NAME_IT": "Indonesia",
                "NAME_JA": "インドネシア",
                "NAME_KO": "인도네시아",
                "NAME_NL": "Indonesië",
                "NAME_PL": "Indonezja",
                "NAME_PT": "Indonésia",
                "NAME_RU": "Индонезия",
                "NAME_SV": "Indonesien",
                "NAME_TR": "Endonezya",
                "NAME_VI": "Indonesia",
                "NAME_ZH": "印度尼西亚"
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": allPolygons
            }
        }
    ]
};

console.log(JSON.stringify(mapJson, undefined, 2));
