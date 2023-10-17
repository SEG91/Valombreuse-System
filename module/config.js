export const System = {};

System.label = "valombreuse";
System.abbrev = "VALOMBREUSE VTT";
System.name = "valombreuse";
System.rootPath = "/systems/" + System.name;
System.dataPath = System.rootPath + "/_data";
System.templatesPath = System.rootPath + "/templates";
System.logPrefix = System.abbrev;
System.debugMode = true;

export const VALOMBREUSE = {};
VALOMBREUSE.competences = [];

// Mise en cache des données de compétences
VALOMBREUSE.getCompetences = async function () {
    let competences;

    competences = await game.packs.get("valombreuse.competences").getDocuments().then(index => index.map(entity => entity.toObject(false)));
    
    VALOMBREUSE.competences = competences;
    console.debug("Competences loaded");
};

VALOMBREUSE.getAptitude = async function () {
    let aptitudes;
    
    VALOMBREUSE.atitudes = aptitudes;
    console.debug("Aptitude loaded");
};

