const MemoryStream = require("memorystream");
const fs = require("fs");
const pdf = require("pdfjs");
const tmp = require("tmp");

const Helvetica = require("pdfjs/font/Helvetica.js");
const HelveticaBold = require("pdfjs/font/Helvetica-Bold.js");
const HelveticaOblique = require("pdfjs/font/Helvetica-Oblique.js");

const loadPDFContract = (result) => {
    console.log(
        result
    );
    const doc = new pdf.Document();

    doc
        .footer()
        .pageNumber(
            (currentPage, totalPage) => `Page ${currentPage} sur ${totalPage}`
        );

    doc.text(`BAIL MOBILITE`, {
        textAlign: "center",
        font: HelveticaBold,
        fontSize: 20,
    });
    doc.text(
        `(Soumis au titre Ier Ter de la loi n° 89-462 du 6 juillet 1989)`,
        {
            textAlign: "center",
            font: Helvetica,
        }
    )
        .br()
        .br();
    doc.text(`I. Désignation des parties`, { font: HelveticaBold }).br();
    doc
        .text(
            `Le présent contrat est conclu entre les soussignés :
Qualité du bailleur :`
        )
        .append(` ${result.bailleur?.denominator ?? ""}`, {
            font: HelveticaBold,
        });
    doc
        .text(`Nom et prénom du bailleur :`)
        .append(
            ` ${result.bailleur?.last_name ?? ""} ${result.bailleur?.first_name ?? ""
            }`,
            {
                font: HelveticaBold,
            }
        );
    result?.cacher_info_proprio ? null : doc
        .text(`Adresse : `)
        .append(` ${result.bailleur?.address ?? ""}`, { font: HelveticaBold });

    doc
        .text(`Adresse email :`)
        .append(` ${result?.cacher_info_proprio ? "stephanjaquet@yahoo.com" : result.bailleur?.email ?? ""}`, { font: HelveticaBold })
    doc
        .text(`Numéro de téléphone :`)
        .append(` ${result?.cacher_info_proprio ? "+33 6 72 64 44 44" : result.bailleur?.phone ?? ""}`, { font: HelveticaBold })
        .br();
    doc
        .text(`désigné (s) ci-après`)
        .append(` « le bailleur » ;`, { font: HelveticaBold });
    doc.text(`Nom et prénom du ou des locataires, adresse email`, { font: HelveticaBold });
    result.locataires?.forEach((locataire) => {
        doc.text(
            `${locataire?.last_name ?? ""} ${locataire?.first_name ?? ""
            }, ${locataire?.email ?? ""}`,
            {
                font: HelveticaBold,
            }
        );
    });
    doc.text(`désigné(s) ci-après`).append(` « le locataire » ;`, { font: HelveticaBold }).br();
    doc.text(`Il a été convenu ce qui suit :`).br();
    doc.text(`II. Objet du contrat`, { font: HelveticaBold }).br();
    doc.text(
        `Le présent contrat a pour objet la location d'un logement dans le cadre d'un `).append(` bail mobilité `, { font: HelveticaBold }).append(` pour le locataire justifiant être dans l'une des situations suivantes :`)
        .br();

    doc.text(`${result.locataires[0]?.situation_locataire ?? ""}`, { font: HelveticaBold }).br();

    doc.text(`    A. Consistance du logement`, { font: HelveticaBold }).br();

    doc.text(`Identifiant fiscal du logement: `).append(`  ${result?.consistance_logement?.identifiant_fiscal_logement ?? ""}`, {
        font: HelveticaBold,
    });
    doc.text(`Adresse du logement : `).append(`  ${result.consistance_logement?.address ?? ""}`, {
        font: HelveticaBold,
    });
    doc
        .text(`Période de construction :`)
        .append(` ${result.consistance_logement?.periode_construction}`, { font: HelveticaBold });
    doc
        .text(`- surface habitable :`)
        .append(` ${result.consistance_logement?.surface ?? ""}`, { font: HelveticaBold }).append(" m²", { font: HelveticaBold });
    doc
        .text(`- nombre de pièces : `)
        .append(` ${result.consistance_logement?.pieces ?? ""}`, { font: HelveticaBold });
    doc
        .text(`- autres parties du logement : `)
        .append(` ${result.consistance_logement?.other ?? ""}`, { font: HelveticaBold })
        .br();
    doc.text(`Éléments d'équipements du logement :`).br();
    doc.text(`${result.consistance_logement?.equipments ?? ""}`, { font: HelveticaBold }).br();
    doc
        .text(`Modalité de production de chauffage : `)
        .append(` ${result.consistance_logement?.chauffage ?? ""}`, { font: HelveticaBold });
    doc
        .text(`Modalité de production d'eau chaude sanitaire : `)
        .append(` ${result.consistance_logement?.eau ?? ""}`, { font: HelveticaBold })
        .br();

    doc
        .text(
            `Équipement d'accès aux technologies de l'information et de la communication [modalités de réception de la télévision dans l'immeuble, modalités de raccordement internet etc.] : `
        )
        .append(` ${result.consistance_logement?.technology ?? ""}`, { font: HelveticaBold })
        .br();

    doc.text(`Rappel: un logement decent doit respecter les critères minimaux de performance suivants :`, { font: HelveticaBold }).br();
    doc.text('a) En France metropolitaine : ', { fontSize: 9 })
    doc.text('I) A compter du 1er janvier 2025, le niveau de performance minimal du logement correspond a la classe F du DPE ;', { fontSize: 9 })
    doc.text('II) A compter du 1er janvier 2028, le niveau de performance minimal du logement correspond a la classe E du DPE ;', { fontSize: 9 })
    doc.text('III) A compter du 1er janvier 2034, le niveau de performance minimal du logement correspond a la classe D du DPE.', { fontSize: 9 })
    doc.text('b) En Guadeloupe, en Martinique, en Guyane, a La Reunion et a Mayotte :', { fontSize: 9 })
    doc.text('I) A compter du 1er janvier 2028, le niveau de performance minimal du logement correspond a la classe F du DPE ;', { fontSize: 9 })
    doc.text('II) A compter du 1er janvier 2031, le niveau de performance minimal du logement correspond a la classe E du DPE.', { fontSize: 9 })
    doc.text("La consommation d'energie finale et le niveau de performance du logement sont determines selon la methode du diagnostic de performance energetique mentionne a l'article L. 126-26 du code de la construction et de l'habitation.", { fontSize: 9 }).br();

    doc.text(`Niveau de performance du logement [classe du diagnostic de performance energetique] : `).append(`  ${result.consistance_logement?.niveau_performance_energetique ?? ""}`, { font: HelveticaBold }).br();
    doc
        .text(
            `
        B. Destination des locaux :` , { font: HelveticaBold }
        )
        .br();
    doc.text("Locaux à usage d'habitation meublée dans le cadre d'un bail mobilité uniquement.")
    doc
        .text(
            `
        C. Désignation des locaux et équipements accessoires de l'immeuble à usage privatif du locataire : `, { font: HelveticaBold }
        )
        .br();
    doc.text(` ${result.consistance_logement?.usage_privatif ?? ""}`, { font: HelveticaBold }).br();
    doc
        .text(
            `
        D. Locaux, parties, équipements et accessoires de l'immeuble à usage commun : `, {
            font: HelveticaBold,
        }
        ).br();

    doc.text(` ${result.consistance_logement?.usage_commun ?? ""}`, {
        font: HelveticaBold,
    })
        .br().br();



    doc
        .text(
            `
  Ill. Date de prise d'effet et durée du contrat`,
            { font: HelveticaBold }
        )
        .br();
    doc.text(`
  La durée du contrat et sa date de prise d'effet sont ainsi définies :`);
    doc.text(`
        A. Date de prise d'effet du contrat : `, { font: HelveticaBold }).append(`  ${result.signature?.date_effet_bail ?? ""}`);
    doc
        .text(
            `
        B. Durée du contrat : `, { font: HelveticaBold }
        )
        .append(` ${result.signature?.duree_bail_mois ?? ""}`, { font: HelveticaBold }).append(` mois (doit être comprise entre 1 et 10 mois)`)
        .br();

    doc
        .text(
            `
  Le bail mobilité est conclu pour une durée minimale d'un mois et une durée maximale de dix mois, non renouvelable et non reconductible. La durée du contrat de location, prévue au 4° du I de l'article 25-13, peut être modifiée une fois par avenant sans que la durée totale du contrat ne dépasse dix mois. Si, au terme du contrat, les parties concluent un nouveau bail portant sur le même logement meublé, ce nouveau bail est soumis aux dispositions du titre Ier bis`,
            { fontSize: 9 }
        )
        .br();
    doc
        .text(
            `
        IV. Conditions financières`,
            { font: HelveticaBold }
        )
        .br();
    doc
        .text(
            `
  Les parties conviennent des conditions financières suivantes :`
        )
        .br();
    doc
        .text(
            `
        A. Loyer`, { font: HelveticaBold }
        )
        .br();
    doc.text(`
  1° Montant du loyer mensuel :`).append(` ${result.loyer.montant_loyer_mensuel ?? ""}`, {
        font: HelveticaBold,
    })
        .br();
    doc.text('2° Modalités particulières de fixation initiale du loyer applicables dans certaines zones tendues :').br();
    doc.text("Le loyer du logement objet du présent contrat est soumis au décret fixant annuellement le montant maximum d'évolution des loyers à la relocation : ").append(`${result.loyer.montant_maximum_evoluton_loyer_relocation ?? ""}`, { font: HelveticaBold }).br();
    doc.text("Le loyer du logement objet du présent contrat est soumis au loyer de référence majoré fixé par arrêté préfectoral : ").append(`${result.loyer.loyer_reference_fixe_arrete_prefectoral ?? ""}`, { font: HelveticaBold }).br();
    doc.text('Montant du loyer de référence : ').append(`${result.loyer.montant_loyer_reference ?? ""}`, { font: HelveticaBold }).br();
    doc.text('Montant du loyer de référence majoré : ').append(`${result.loyer.montant_loyer_reference_majore ?? ""}`, { font: HelveticaBold }).br();
    doc.text('3° Le cas échéant, informations relatives au loyer du dernier locataire (montant du dernier loyer acquitté par le précédent locataire, date de versement et date de la dernière révision du loyer) :').append(`${result.loyer.cas_echeant_loyer_dernier_locataire ?? ""}`, { font: HelveticaBold }).br();

    doc
        .text(
            `
        B. Charges récupérables`, { font: HelveticaBold }
        )
        .br();

    doc.text('1° Montant des charges récupérables : Forfait de charges').br()

    doc.text("Montant du forfait de charge : ").append(`${result.charges_recuperables.montant_forfait_charge ?? ""}`, { font: HelveticaBold }).append(' €/mois').br();
    doc.text("Les charges locatives accessoires au loyer principal sont récupérées par le bailleur sous la forme d'un forfait versé simultanément au loyer, dont le montant et la périodicité de versement sont définis dans le contrat et qui ne peut donner lieu à complément ou à régularisation ultérieure. Le montant du forfait de charges est fixé en fonction des montants exigibles par le bailleur en application de l'article 23. Ce montant ne peut pas être manifestement disproportionné au regard du dernier décompte par nature de charges rapporté à la périodicité de versement du forfait.").br();

    doc.text("      C. Modalités de paiement", { font: HelveticaBold }).br();

    doc.text("Périodicité du paiement :").append(` ${result.loyer?.periodicite_paiement ?? ""}`, { font: HelveticaBold }).br();
    doc.text("Paiement : ").append(`${result.loyer?.paiement ?? ""}`, { font: HelveticaBold }).br();
    doc.text("Date ou période de paiement :").append(` ${result.loyer?.date_ou_periode_paiement ?? ""}`, { font: HelveticaBold }).br();
    doc.text("Le cas échéant, montant total dû à la première échéance de paiement pour une période complète de location [détailler la somme des montants relatifs au loyer, au forfait de charges, à l’assurance récupérable pour le compte des colocataires...] : ").append(`${result.loyer?.cas_echeant_montant_total_du_premier_paiement ?? ""}`, { font: HelveticaBold }).br();
    doc
        .text(
            `
        V. Travaux`,
            { font: HelveticaBold }
        )
        .br();
    doc
        .text(
            `
            Nature et le montant des travaux effectués dans le logement depuis la fin du dernier contrat de location : `
        ).br().append(` ${result.travaux ?? ""}`, {
            font: HelveticaBold,
        })
        .br();
    doc
        .text(
            `
        VI. Clause résolutoire`,
            {
                font: HelveticaBold,
            }
        )
        .br();
    doc
        .text(
            `
            Modalités de résiliation de plein droit du contrat : Le bail sera résilié de plein droit en cas d'inexécution des obligations du locataire, soit en cas de défaut de paiement des loyers et des charges locatives au terme convenu, de non versement du dépôt de garantie, de défaut d'assurance du locataire contre les risques locatifs, de troubles de voisinage constatés par une décision de justice passée en force de chose jugée rendue au profit d'un tiers. Le bailleur devra assigner le locataire devant le tribunal pour faire constater l'acquisition de la clause résolutoire et la résiliation de plein droit du bail. Lorsque le bailleur souhaite mettre en œuvre la clause résolutoire pour défaut de paiement des loyers et des charges ou pour non-versement du dépôt de garantie, il doit préalablement faire signifier au locataire, par acte de commissaire de justice, un commandement de payer, qui doit mentionner certaines informations et notamment la faculté pour le locataire de saisir le fonds de solidarité pour le logement. De plus, pour les bailleurs personnes physiques ou les sociétés immobilières familiales, le commandement de payer doit être signalé par le commissaire de justice à la commission de coordination des actions de prévention des expulsions locatives dès lors que l'un des seuils relatifs au montant et à l'ancienneté de la dette, fixé par arrêté préfectoral, est atteint. Le locataire peut, à compter de la réception du commandement, régler sa dette, saisir le juge d'instance pour demander des délais de paiement, voire demander ponctuellement une aide financière à un fonds de solidarité pour le logement. Si le locataire ne s'est pas acquitté des sommes dues dans les six semaines suivant la signification, le bailleur peut alors assigner le locataire en justice pour faire constater la résiliation de plein droit du bail. En cas de défaut d'assurance, le bailleur ne peut assigner en justice le locataire pour faire constater l'acquisition de la clause résolutoire qu'après un délai d'un mois après un commandement demeuré infructueux. `
            , { fontSize: 9 }).br();
    doc
        .text(
            `
  VII. Autres conditions particulières`,
            {
                font: HelveticaBold,
            }
        )
        .br();
    doc
        .text(
            `
            ${result.autres_conditions_particulieres ?? ""}
            `
        )
        .br();
    doc
        .text(
            `
  VIII. Dépôt de garantie et clause de solidarité`,
            {
                font: HelveticaBold,
            }
        )
        .br();
    doc
        .text(
            `
            Dans le cadre du bail mobilité, aucun dépôt de garantie ne peut être exigé par le bailleur. De même, toute clause
            prévoyant une solidarité entre les colocataires ou leurs cautions est réputée non écrite.`
        ).br();


    doc
        .text(
            `
            IX. Annexes`,
            {
                font: HelveticaBold,
            }
        )
        .br();

    doc.text(
        `
      Sont annexées et jointes au contrat de location les pièces suivantes :`
    ).br();

    doc.text("A. Le cas échéant, un extrait du règlement concernant la destination de l’immeuble, la jouissance et l’usage des parties privatives et communes, et précisant la quote-part afférente au lot loué dans chacune des catégories de charges.", { font: HelveticaBold })
    doc.text("B. Un dossier de diagnostic technique comprenant :", { fontSize: 9 })
    doc.text("- un diagnostic de performance énergétique ;", { fontSize: 9 })
    doc.text("- un constat de risque d’exposition au plomb pour les immeubles construits avant le 1er janvier 1949 ;", { fontSize: 9 })
    doc.text("- le cas échéant, une copie d’un état mentionnant l’absence ou la présence de matériaux ou de produits de la construction contenant de l’amiante ;", { fontSize: 9 })
    doc.text("- le cas échéant, un état de l’installation intérieure d’électricité et de gaz, dont l’objet est d’évaluer les risques pouvant porter atteinte à la sécurité des personnes ;", { fontSize: 9 })
    doc.text("- le cas échéant, un état des risques naturels et technologiques pour le zones couvertes par un plan de prévention des risques technologiques ou par un plan de prévention des risques naturels prévisibles, prescrit ou approuvé, ou dans des zones de sismicité.", { fontSize: 9 })
    doc.text("C. Une notice d’information relative aux droits et obligations des locataires et des bailleurs.", { fontSize: 9 })
    doc.text("D. Un état des lieux, un inventaire et un état détaillé du mobilier.", { fontSize: 9 })
    doc.text("E. Le cas échéant, une autorisation préalable de mise en location.", { fontSize: 9 })
    doc.text("F. Le cas échéant, Les références aux loyers habituellement constatés dans le voisinage pour des logements comparables.", { fontSize: 9 }).br().br();

    doc.text(
        `
  Le ${result.signature?.date_signature ?? ""}, à ${result.signature?.lieu ?? ""}`,
        {
            font: HelveticaBold,
        }
    );
    doc
        .text(
            `
  Signature du bailleur                                                                  Signature du locataire
  `
        )
        .br();

    const memStream = new MemoryStream(null, {
        readable: false,
    });

    doc.pipe(memStream);

    doc.on("end", function () {
        try {
            const pdfBuffer = Buffer.concat(memStream.queue);

            const tempPDF = tmp.fileSync({ postfix: ".pdf" });

            fs.writeFileSync(tempPDF.name, pdfBuffer);

            const fileStat = fs.statSync(tempPDF.name);

            strapi.plugins.upload.services.upload.upload({
                data: {
                    refId: result.id,
                    ref: "api::contrats-bail-mobilite.contrats-bail-mobilite",
                    field: "contrat",
                },
                files: {
                    path: tempPDF.name,
                    name: `contrat_bail_mobilite_${result.locataires[0]?.last_name ?? ""}${result.id}${"_" + result.updatedAt
                        }.pdf`,
                    type: "application/pdf",
                    size: fileStat.size,
                },
            });
        } catch (error) {
            console.log(error);
        }
    });
    doc.end();
};

module.exports = {
    async afterCreate (event) {
        const { result } = event;
        const logementWithAmenities = await strapi.entityService.findOne("api::rent.rent", result.logement.id, {
            populate: ["amenities"],
        });
        console.log("amenities :", logementWithAmenities);
        loadPDFContract(result);
    },
    async beforeUpdate (event) {
        event.params.data.contract = null;
    },
    async afterUpdate (event) {
        const { result } = event;

        loadPDFContract(result);
    },
};
