import { VALOMBREUSE } from "./config.js";
import {Traversal} from "./utils/traversal.js";

let globalcount=0;
let CurrentObject;

export const registerHandlebarsHelpers = function () {


    Handlebars.registerHelper('getOrigines', function (items) {
        return items.find(item => item.type === "origine");
    });

    Handlebars.registerHelper('getOrdre', function (items) {
        return items.find(item => item.type === "ordre");
    });

    Handlebars.registerHelper('getInventory', function (items) {
        let inventory = items.filter(item => item.type === "item");
        inventory.sort(function (a, b) {
            const aKey = a.system.subtype + "-" + a.name.slugify({strict: true});
            const bKey = b.system.subtype + "-" + b.name.slugify({strict: true});
            return (aKey > bKey) ? 1 : -1
        });
        return inventory;
    });

    Handlebars.registerHelper('getSecrets', function (items) {
        let inventory = items.filter(item => item.type === "secrets");
        inventory.sort(function (a, b) {
            const aKey = a.system.subtype + "-" + a.name.slugify({strict: true});
            const bKey = b.system.subtype + "-" + b.name.slugify({strict: true});
            return (aKey > bKey) ? 1 : -1
        });
        return inventory;
    });

    Handlebars.registerHelper('getVeinepowers', function (items) {
        let inventory = items.filter(item => item.type === "veinebloodpower");
        inventory.sort(function (a, b) {
            const aKey = a.system.subtype + "-" + a.name.slugify({strict: true});
            const bKey = b.system.subtype + "-" + b.name.slugify({strict: true});
            return (aKey > bKey) ? 1 : -1
        });
        return inventory;
    });

    
    Handlebars.registerHelper('getArraySubCategorywithItems', function (items) {
        let subCat=VALOMBREUSE.itemSubCategories;
        var itemByCat = [];
        for (const [key, value] of Object.entries(subCat)) {

            let caps = items.filter(item => item.type === "item");
            let weapons = caps.filter(item => item.system.subtype == key);
            weapons.sort(function (a, b) {
                const aKey = a.name.slugify({strict: true});
                const bKey = b.name.slugify({strict: true});
                return (aKey > bKey) ? 1 : -1
            });

            itemByCat.push({
                key: key,
                value: value,
                items: weapons
            });
        }

        //Add all items with no categories
        let caps = items.filter(item => item.type === "item");
        let weapons = caps.filter(item => item.system.subtype == "");
        weapons.sort(function (a, b) {
            const aKey = a.name.slugify({strict: true});
            const bKey = b.name.slugify({strict: true});
            return (aKey > bKey) ? 1 : -1
        });

        itemByCat.push({
            key: "",
            value: game.i18n.localize("VALOMBREUSE.category.other"),
            items: weapons
        });

        return itemByCat;
    });

    Handlebars.registerHelper('getArraySecretCategorywithItems', function (items) {
        let subCat=VALOMBREUSE.secretCategories;
        var itemByCat = [];
        for (const [key, value] of Object.entries(subCat)) {

            let caps = items.filter(item => item.type === "secrets");
            let weapons = caps.filter(item => item.system.type == key);
            weapons.sort(function (a, b) {
                const aKey = a.name.slugify({strict: true});
                const bKey = b.name.slugify({strict: true});
                return (aKey > bKey) ? 1 : -1
            });

            itemByCat.push({
                key: key,
                value: value,
                items: weapons
            });
        }

        //Add all items with no categories
        let caps = items.filter(item => item.type === "secrets");
        let weapons = caps.filter(item => item.system.type == "");
        weapons.sort(function (a, b) {
            const aKey = a.name.slugify({strict: true});
            const bKey = b.name.slugify({strict: true});
            return (aKey > bKey) ? 1 : -1
        });

        itemByCat.push({
            key: "",
            value: game.i18n.localize("VALOMBREUSE.category.other"),
            items: weapons
        });

        return itemByCat;
    });

    Handlebars.registerHelper('InitializeGlobalCount', function () {
        globalcount=0;
        return ;
    });

    Handlebars.registerHelper('IncreaseGlobalCount', function () {
     globalcount++;
    });

    Handlebars.registerHelper('SetCurrentObject', function (ThisACtor) {
        CurrentObject=ThisACtor;
       });

    Handlebars.registerHelper('CompareGlobalCount', function (num) {
        if (globalcount == num)
        {
            return true;
        }
        else return false;
       });

    Handlebars.registerHelper('getItemSubCategories', function () {
        return VALOMBREUSE.itemSubCategories;
    });

    Handlebars.registerHelper('getSecretCategories', function () {
        return VALOMBREUSE.secretCategories ;
    });

    Handlebars.registerHelper('getActioncards', function () {
        let items =VALOMBREUSE.Actioncards;
        let caps = items.filter(item => item.type === "combatcard").sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
       
        return caps;
    });

    

    Handlebars.registerHelper('getOrdreNames', function () {
        let OrdreNames=[];
        for (let pas = 0; pas < VALOMBREUSE.Ordres.length; pas++) {
            OrdreNames.push(VALOMBREUSE.Ordres[pas].name)
        }
        OrdreNames.push("Bande");
        OrdreNames.push("Créature");
        OrdreNames.push("PNJ");
        OrdreNames.sort();
        return OrdreNames;
    });

    Handlebars.registerHelper('getBloodpowersbyRank', function (items) {
        let Bloodpowers=[];
        for (let pas = 0; pas < VALOMBREUSE.Blooddomains.length; pas++) {
            if (VALOMBREUSE.Blooddomains[pas]._id == items._id){
                let bldpwlist = VALOMBREUSE.Blooddomains[pas].system.bloodpowers;
                for (let pas2 = 0; pas2 < bldpwlist.length; pas2++) {
                    if (bldpwlist[pas2].system.score <= items.system.score){
                        Bloodpowers.push(bldpwlist[pas2])
                        }
                    }
                    break;
                }
            }
        
        return Bloodpowers;
    });

    Handlebars.registerHelper('getBloodpowers', function (items) {
        let caps = CurrentObject.items.filter(item => item.type === "bloodpower").sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
       
        return caps;
    });
    

    Handlebars.registerHelper('getItemsBySubCategory', function (subCat, items) {
        let caps = items.filter(item => item.type === "item");
        let weapons = caps.filter(item => item.system.subtype == subCat);
        weapons.sort(function (a, b) {
            const aKey = a.name.slugify({strict: true});
            const bKey = b.name.slugify({strict: true});
            return (aKey > bKey) ? 1 : -1
        });
        return weapons;
    });

    Handlebars.registerHelper('getEquiped', function (items) {
        let equiped = items.filter(item => item.type === "item" && item.system.equiped);
        equiped.sort(function (a, b) {
            const aKey = a.system.subtype + "-" + a.name.slugify({strict: true});
            const bKey = b.system.subtype + "-" + b.name.slugify({strict: true});
            return (aKey > bKey) ? 1 : -1
        });
        return equiped;
    });

    Handlebars.registerHelper('getItems', function (items) {
        return items.filter(item => item.type === "item");
    });

    Handlebars.registerHelper('getLignee', function (items) {
        return items.find(item => item.type === "bloodline");
    });
      
    Handlebars.registerHelper('getCompetences', function (items) {
        let caps = items.filter(item => item.type === "competence").sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
       
        return caps;
    });

    Handlebars.registerHelper('getRoyaumes', function (items) {
        let caps = items.filter(item => item.type === "origine").sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
       
        return caps;
    });

    Handlebars.registerHelper('getBlooddomains', function (items) {
        let caps = items.find(item => item.type === "bloodline");
       if (caps)
        return caps.system.blooddomains;
    });

    Handlebars.registerHelper('getAptitudes', function (items) {
        let caps = items.filter(item => item.type === "aptitude").sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
       
        return caps;
    });

    Handlebars.registerHelper('getOrdres', function (items) {
        let caps = items.filter(item => item.type === "ordre").sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
       
        return caps;
    });

    Handlebars.registerHelper('getWeapons', function (items) {
        let caps = items.filter(item => item.type === "item");
        let weapons = caps.filter(item => item.system.properties.weapon === true ||  item.system.subtype == "melee" ||  item.system.subtype == "ranged" ||  item.system.subtype == "natural");
        return weapons;
    });

    Handlebars.registerHelper('getEquipedWeapons', function (items) {
        let caps = items.filter(item => item.type === "item");
        let weapons = caps.filter(item => item.system.properties.weapon === true ||  item.system.subtype == "melee" ||  item.system.subtype == "ranged"||  item.system.subtype == "natural");
        let equipedWeapons = weapons.filter(item => item.system.equiped === true);
        return equipedWeapons;
    });

    Handlebars.registerHelper('useMagic', function (actor) {

        let items = actor.items;
        let caps = items.filter(item => item.type === "competence").sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
        let caps_spe = caps.filter(item => item.system.special === true);
        let caps_magie = caps.filter(item => item.name === "Modélisation");

        return caps_magie.length > 0;
    });

    Handlebars.registerHelper('IsCharacter', function (actor) {

        if (actor.type === "character")
            return true;
        else
            return false ;
    });

    Handlebars.registerHelper('IsSangImpur', function (blooddomain) {

        let flag=false;
        if (blooddomain.name ==="Domaine de Sang Impur")
        {
            flag=true;
        }
        return flag;
    });

    Handlebars.registerHelper('isWeapon', function (item) {
        if( item.system.properties.weapon === true ||  item.system.subtype == "melee" ||  item.system.subtype == "ranged"||  item.system.subtype == "natural")
            return true;
        else
            return false;
    });

    Handlebars.registerHelper('isState', function (item) {
        if( item.system.subtype == "state")
            return true;
        else
            return false;
    });

    Handlebars.registerHelper('isArmor', function (item) {
        if(   item.system.subtype == "shield" ||  item.system.subtype == "armor")
            return true;
        else
            return false;
    });

    Handlebars.registerHelper('splitWeaponDice', function (formula) {
        let terms = formula.split("+");
        return terms[0];
    });

    Handlebars.registerHelper('splitWeaponMod', function (formula) {
        let terms = formula.split("+");
        return terms[1];
    });

    Handlebars.registerHelper('isNull', function (val) {
        return val == null;
    });

    Handlebars.registerHelper('isEmpty', function (list) {
        if (list) return list.length == 0;
        else return 0;
    });

    Handlebars.registerHelper('notEmpty', function (list) {
        return list.length > 0;
    });

    Handlebars.registerHelper('isZeroOrNull', function (val) {
        return val == null || val == 0;
    });

    Handlebars.registerHelper('isNegative', function (val) {
        return val < 0;
    });

    Handlebars.registerHelper('isNegativeOrNull', function (val) {
        return val <= 0;
    });

    Handlebars.registerHelper('isPositive', function (val) {
        return val > 0;
    });

    Handlebars.registerHelper('isPositiveOrNull', function (val) {
        return val >= 0;
    });

    Handlebars.registerHelper('equals', function (val1, val2) {
        return val1 == val2;
    });

    Handlebars.registerHelper('gt', function (val1, val2) {
        return val1 > val2;
    });

    Handlebars.registerHelper('lt', function (val1, val2) {
        return val1 < val2;
    });

    Handlebars.registerHelper('gte', function (val1, val2) {
        return val1 >= val2;
    });

    Handlebars.registerHelper('lte', function (val1, val2) {
        return val1 <= val2;
    });
    Handlebars.registerHelper('and', function (val1, val2) {
        return val1 && val2;
    });

    Handlebars.registerHelper('or', function (val1, val2) {
        return val1 || val2;
    });

    Handlebars.registerHelper('not', function (cond) {
        return !cond;
    });

    Handlebars.registerHelper('isEnabled', function (configKey) {
        return game.settings.get("valombreuse", configKey);
    });

    Handlebars.registerHelper('isValombreuseTypeSetting', function (configKey) {
        return (game.settings.get("valombreuse", "valombreuseVersion") == configKey);
    });

    Handlebars.registerHelper('split', function (str, separator, keep) {
        return str.split(separator)[keep];
    });

    Handlebars.registerHelper('listProfessions', function () {
        return Traversal.getAllProfessionsData()
    });

    Handlebars.registerHelper('listOrigines', function () {
        return Traversal.getAllOriginesData()
    });

    Handlebars.registerHelper('findCompetence', function (key) {
        return Traversal.getAllCompetencesData().find(c => c.system.key === key);
    });

    // If you need to add Handlebars helpers, here are a few useful examples:
    Handlebars.registerHelper('concat', function () {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper('add', function (a, b) {
        return parseInt(a) + parseInt(b);
    });

    Handlebars.registerHelper('valueAtIndex', function (arr, idx) {
        return arr[idx];
    });

    Handlebars.registerHelper('includesKey', function (items, type, key) {
        return items.filter(i => i.type === type).map(i => i.system.key).includes(key);
    });

    Handlebars.registerHelper('ifequal', function (a, b, options) {
        if (a == b) { return options.fn(this); }
        return options.inverse(this);
    });


    Handlebars.registerHelper('isActorHand', function (actor, handId) {
        return actor.getDefaultHand().id == handId;
    });

    Handlebars.registerHelper('isActorDeck', function (actor, handId) {
        return actor.getDefaultDeck().id == handId;
    });

    Handlebars.registerHelper('isActorDiscard', function (actor, handId) {
        return actor.getDefaultDiscard().id == handId;
    });

    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
      
        if (optionalValue) {
          console.log("Value");
          console.log("====================");
          console.log(optionalValue);
        }
      });
}