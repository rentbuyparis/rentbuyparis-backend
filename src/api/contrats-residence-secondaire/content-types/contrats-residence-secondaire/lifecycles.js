const MemoryStream = require("memorystream");
const fs = require("fs");
const pdf = require("pdfjs");
const tmp = require("tmp");

const Helvetica = require("pdfjs/font/Helvetica.js");
const HelveticaBold = require("pdfjs/font/Helvetica-Bold.js");
const HelveticaOblique = require("pdfjs/font/Helvetica-Oblique.js");

const dayjs = require("dayjs");

const loadPDFContract = (result) => {
    console.log(
        result
    );
    const doc = new pdf.Document();

    doc.header().text("RentBuyParis", {
        textAlign: "right",
        font: HelveticaBold,
    });

    doc
        .footer()
        .pageNumber(
            (currentPage, totalPage) => `Page ${currentPage} sur ${totalPage}`
        );
    doc.text(`CONTRAT DE LOCATION - RESIDENCE SECONDAIRE `, {
        textAlign: "center",
        font: HelveticaBold,
        fontSize: 20,
        textTransform: "uppercase",
    });
    doc.text(
        `Bail régi par les dispositions des articles 1714 à 1762 du Code civil`,
        {
            textAlign: "center",
            font: HelveticaOblique,
        }
    ).br()
        .br().br();



    doc.text(`CONTRAT DE LOCATION - RESIDENCE SECONDAIRE `, { font: HelveticaBold, textTransform: "uppercase" }).br();
    doc.text("*BAILLEUR PERSONNE PHYSIQUE", { font: HelveticaOblique }).br();


    doc
        .text(`NOM :`)
        .append(
            ` ${result.bailleur?.last_name ?? ""}`,
            {
                font: HelveticaBold,
            }
        );
    doc
        .text(`Prénoms (dans l'odre de l'état civil) :`)
        .append(
            ` ${result.bailleur?.first_name ?? ""
            }`,
            {
                font: HelveticaBold,
            }
        );
    doc
        .text(`Date et lieu de naissance :`)
        .append(
            ` ${dayjs(result.bailleur?.birthDate) ?? ""
            } ${result.bailleur?.birthPlace ?? ""}`,
            {
                font: HelveticaBold,
            }
        );


    doc
        .text(`Nationalité :`)
        .append(
            ` ${result.bailleur?.nationality ?? ""}`,
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

    doc.text(`Désigné comme LE BAILLEUR dans la suite des présentes,`, { font: HelveticaBold }).br();
    doc.text("                                                                                                                         D'UNE PART,", { font: HelveticaBold }).br();
    doc.text("ET", { font: HelveticaBold }).br().br();

    doc.text("*PRENEUR PERSONNE PHYSIQUE", { font: HelveticaOblique }).br();


    doc
        .text(`NOM :`)
        .append(
            ` ${result.locataire?.last_name ?? ""} `,
            {
                font: HelveticaBold,
            }
        );
    doc
        .text(`Prénoms (dans l'odre de l'état civil) :`)
        .append(
            ` ${result.locataire?.first_name ?? ""
            }`,
            {
                font: HelveticaBold,
            }
        );
    doc
        .text(`Date et lieu de naissance :`)
        .append(
            ` ${dayjs(result.locataire?.birthDate) ?? ""
            } ${result.locataire?.birthPlace ?? ""}`,
            {
                font: HelveticaBold,
            }
        );

    doc
        .text(`Nationalité :`)
        .append(
            ` ${result.locataire?.nationality ?? ""}`,
            {
                font: HelveticaBold,
            }
        );

    doc
        .text(`Résidant :`)
        .append(
            ` ${result.locataire?.address ?? ""}`,
            {
                font: HelveticaBold,
            }
        );

    doc
        .text(`Adresse e-mail :`)
        .append(
            ` ${result.locataire?.email ?? ""}`,
            {
                font: HelveticaBold,
            }
        );
    doc
        .text(`Numéro de téléphone :`)
        .append(
            ` ${result.locataire?.phone ?? ""}`,
            {
                font: HelveticaBold,
            }
        ).br();

    doc.text(`Désigné comme LE LOCATAIRE dans la suite des présentes,`, { font: HelveticaBold }).br();
    doc.text("                                                                                                       D'UNE PART,").br();


    doc.text(`            IL A ÉTÉ CONVENU ET ARRETÉ CE QUI SUIT : `, { font: HelveticaBold, }).br();

    doc.text(`Le bailleur loue au locataire qui accepte les lieux ci-après désignés, à titre de résidence secondaire.`, { font: HelveticaBold }).br();

    doc.text(`Article 1 : DÉSIGNATION DES LOCAUX LOUÉS`, { font: HelveticaBold }).br();

    doc.text(`- Adresse du logement :`).append(`${result?.logement?.street}, ${result.logement?.zipCode}, ${result?.logement?.city} `, {
        font: HelveticaBold,
    });
    doc
        .text(`- Détails localisation : étage n°`)
        .append(` ${result.logement?.floor ?? ""}`, { font: HelveticaBold });
    doc
        .text(`- Type de bien :`)
        .append(` ${result.logement?.type_bien ?? ""}`, { font: HelveticaBold });
    doc
        .text(`- Type d'habitation :`)
        .append(` ${result.logement?.type_habitation ?? ""}`, { font: HelveticaBold });
    doc
        .text(`- Nombre de pièces principales : `)
        .append(` ${result.logement?.rooms ?? ""}`, { font: HelveticaBold });
    doc
        .text(`- Surface indicative : `)
        .append(` ${result.logement?.space ?? ""}`, { font: HelveticaBold }).append(" m²", { font: HelveticaBold });

    doc.text(`Production d'eau chaude :`).append(` ${result.logement?.production_eau_chaude ?? ""}`, { font: HelveticaBold });
    doc.text(`Production de chauffage : `)
        .append(` ${result.logement?.production_chauffage ?? ""}`, { font: HelveticaBold }).br();

    doc
        .text(
            `Le cas échéant, les meubles sont listés dans un inventaire séparé annexé au présent bail.`
            , { font: HelveticaBold })
        .br();

    doc.text(`Ainsi que le tout existe, sans exceptions ni réserves, le locataire déclarant connaître parfaitement les lieux pour les avoir visités en vue de la présente location et les prendre dans l'état dans lequel ils se trouvent.`).br();

    doc
        .text(
            `Article 2 : DESTINATION`, { font: HelveticaBold }
        ).br();

    doc.text("Les locaux sont loués",).append(" exclusivement à titre de résidence secondaire", { font: HelveticaBold }).append(" ; ils ne constituent pas la résidence principale du Locataire, ce dernier ayant transmis au bailleur tout élément justifiant de sa domiciliation à titre de résidence principale dans son logement habituel.").br();

    doc.text(`Article 3 : DURÉE`, { font: HelveticaBold }).br();

    doc.text("La présente location est consentie et acceptée pour une durée de").append(` ${result.duree_bail_mois ?? ""}`, { font: HelveticaBold }).append(" mois, qui commence à courir le").append(` ${dayjs(result.date_debut_bail).format("DD/MM/YYYY") ?? ""}`, { font: HelveticaBold }).append(" pour se terminer le").append(` ${dayjs(result.date_fin_bail).format("DD/MM/YYYY") ?? ""}`, { font: HelveticaBold }).br().append("En aucun cas, le bail ne sera prolongé sans accord exprès du propriétaire ou de son mandataire.", { font: HelveticaBold }).br();

    doc.text(`Article 4 : CONGÉ`, { font: HelveticaBold }).br();

    doc.text("Congé du Bailleur : à tout moment avec un préavis de 1 mois, sans avoir à justifier du motif.");
    doc.text("Congé du Locataire : à tout moment avec un préavis de 1 mois, sans avoir à justifier du motif.").br();

    doc.text(`Article 5 : LOYER`, { font: HelveticaBold }).br();

    doc.text("- Loyer mensuel de ").append(` ${result.montant_loyer ?? ""}`, { font: HelveticaBold }).append(" €", { font: HelveticaBold }).append(`(hors électricité et internet, en supplément);`).br();
    doc.text("- Le paiement sera effectué le ").append(` ${result.numJourPaiement}`, { font: HelveticaBold }).append(" de chaque mois", { font: HelveticaBold }).append(", au bailleur, ou en tout autre endroit désigné par lui.").br();
    doc.text("- Le premier paiement devant avoir lieu le").append(` ${dayjs(result.datePremierPaiement)}`).br();


    doc.text(`Article 6 : CLAUSE DE SOLIDARITÉ`, { font: HelveticaBold }).br();

    doc.text("En cas de pluralité de locataires, ceux-ci sont tenus solidairement des obligations prévues au présent contrat, ces derniers reconnaissent être solidaires et indivis pour l'exécution de leurs obligations. Lorsqu'un des colocataires donne congé, la solidarité des locataires restants se prolonge jusqu'à résiliation définitive du bail.").br();

    doc.text(`Article 7 : CHARGES RÉCUPÉRABLES`, { font: HelveticaBold }).br();

    doc.text("Les parties conviennent que le montant du loyer s'entend charges comprises, hors électricité et internet, à la charge du locataire.");
    doc.text("Les charges sont, par défaut, définies comme les charges et réparations locatives prévues par les décrets n°87-712 et n°87-713 du 26 août 1987 annexés aux présentes.").br();

    doc.text(`Article 8 : DÉPÔT DE GARANTIE`, { font: HelveticaBold }).br();

    doc.text("À la signature des présentes, le locataire verse au bailleur qui le reconnaît et lui en donne quittance, la somme de").append(` ${result.depot ?? ""}`, { font: HelveticaBold }).append(" € représentant 1 mois de loyer à titre de dépôt de garantie.", { font: HelveticaBold }).br();

    doc.text("Cette somme qui ne sera pas productive d'intérêt, sera remboursée au locataire, en fin de bail, après remise des clés, déduction faite de toutes les sommes dont il pourrait être débiteur envers le bailleur, ou dont celui-ci pourrait être rendu responsable pour le locataire à quelque titre que ce soit.").br().br().br();

    doc.text("Article 8Bis : CAUTION (le cas échéant)", { font: HelveticaBold }).br();
    doc.text("L'exécution du présent bail est garantie par").append(` ${result.garant_caution_name ?? ""}`, { font: HelveticaBold }).append(" demeurant").append(` ${result.garant_caution_address ?? ""}`, { font: HelveticaBold }).append(" en qualité de caution solidaire. La caution renonce donc aux bénéfices de discussion et de division pour les obligations du locataire résultant de la signature du présent bail.").br();

    doc.text(`Article 9 : OCCUPATION – JOUISSANCE – SOUS-LOCATION`, { font: HelveticaBold }).br();

    doc.text("- Le locataire occupera les lieux personnellement avec sa famille. Il ne pourra y installer des tiers en sa présence ou en son absence ;")
    doc.text("- Il ne pourra ni prêter, ni sous-louer, en tout ou en partie, les lieux loués, sous aucun prétexte, même provisoirement ou à titre gracieux ;")
    doc.text("- Il ne pourra céder, en totalité ou en partie, son droit à la présente location ;")
    doc.text("- Il devra jouir des lieux loués raisonnablement, sans rien faire qui puisse nuire à la tranquillité des autres locataires et à la bonne tenue de la maison, et tenir les lieux loués constamment garnis de meubles et objets mobiliers en quantité et en valeur suffisantes pour répondre du paiement des loyers et des charges et de l'exécution de toutes les conditions du présent contrat.").br();


    doc.text(`Article 10 : ENTRETIEN - TRAVAUX – RÉPARATIONS`, { font: HelveticaBold }).br();

    doc.text("- Le locataire prendra les lieux dans l'état dans lequel ils se trouvent au moment de l'entrée en jouissance ;")
    doc.text("- Il devra les entretenir, pendant toute la durée de la location, et les rendre, en fin de bail, en bon état de réparations locatives et d'entretien lui incombant, notamment du fait des dégradations survenues de son fait ou du fait de personnes à son service ;")
    doc.text("- Il ne pourra faire aucun percement de mur, ni changement de distribution, ni travaux ou aménagement dans les lieux loués sans l'autorisation expresse et par écrit du bailleur ;")
    doc.text("- Il devra laisser, à la fin du bail, dans l'état où ils se trouvent, sans pouvoir réclamer aucune indemnité, les décors, embellissements et autres travaux qu'il aura fait faire, dans le respect de la clause précédente, à moins que le bailleur ne préfère demander le rétablissement des lieux en leur état primitif, aux frais du locataire ;")
    doc.text("- Il devra entretenir en bon état les canalisations intérieures, les robinets d'eau, les canalisations et appareillages électriques ou de gaz ;")
    doc.text("- Il devra faire ramoner, à ses frais, aussi souvent qu'il sera nécessaire ou prescrit par les règlements administratifs, les cheminées ou conduits de fumée, et faire entretenir régulièrement, et au moins une fois par an, tous les appareillages et installations diverses pouvant exister dans les lieux loués ;")
    doc.text("- Il devra laisser le bailleur visiter les lieux ou les faire visiter chaque fois que cela sera nécessaire pour l'entretien, les réparations et la sécurité de l'immeuble ; il s'engage à prévenir immédiatement le bailleur de toutes dégradations qu'il constaterait dans les lieux loués, entraînant des réparations à la charge du propriétaire. Au cas où il manquerait à cet engagement, il ne pourrait réclamer aucune indemnité à la charge du bailleur en raison de ces dégradations et serait responsable envers lui de l'aggravation du dommage, survenue après la date à laquelle il l'a constatée.").br();

    doc.text(`Article 11 : ASSURANCE - RESPONSABILITÉ ET RECOURS`, { font: HelveticaBold }).br();

    doc.text("Le locataire devra faire assurer convenablement contre l'incendie, les explosions, les dégâts des eaux, son mobilier ainsi que le recours des voisins et les risques locatifs, par une compagnie notoirement solvable et justifier de cette assurance et du paiement des primes, à toute demande du bailleur.");
    doc.text("Il devra déclarer immédiatement à la compagnie d'assurances et en informer en même temps le propriétaire, tout sinistre ou dégradation se produisant dans les lieux loués, sous peine d'être rendu personnellement responsable du défaut de déclaration en temps utile.")
    doc.text("Il ne pourra exercer aucun recours contre le bailleur en cas de vol, cambriolage ou acte délictueux dont il pourrait être victime dans les lieux loués et devra faire son affaire personnelle de toute assurance à ce sujet.").br();

    doc.text("Article 12 : RÉGLEMENTATION GÉNÉRALE", { font: HelveticaBold }).br();
    doc.text("Le locataire devra acquitter exactement toutes les contributions personnelles et mobilières et satisfaire à toutes les charges de ville et de police dont les locataires sont ordinairement tenus, de manière que le bailleur ne soit point inquiété ni recherché à ce sujet.");
    doc.text("- Il devra se conformer aux usages en vigueur, aux règlements de police, au règlement de copropriété de l'immeuble ainsi qu'à tout règlement intérieur.");
    doc.text("- Il devra veiller à ce que la tranquillité de l'immeuble ne soit troublée, en aucune manière, par son fait ou les gens de sa famille ou à son service.").br();
    doc.text("- Il ne pourra rien déposer sur les appuis de fenêtres, balcons et ouvertures quelconques, qui puisse présenter un danger pour les autres occupants de l’immeuble ou leur occasionner une gêne ou nuire à l’aspect de l’immeuble.")
    doc.text("- Il ne devra déposer aucun objet, paquet ou effet mobilier et ne faire aucun déballage dans les parties communes.")
    doc.text("- Il ne devra faire stationner, à aucune heure du jour ou de la nuit, dans la cour ou sous la voûte d’entrée, aucun véhicule ni voiture d’enfant sans autorisation expresse et par écrit du bailleur.")
    doc.text("- Il devra donner accès, dans les lieux loués : au bailleur, au syndic ou à leurs représentants, à leurs architectes ou entrepreneurs, aussi souvent qu’il sera nécessaire.")
    doc.text("- En cas d’existence ou d’installations d’antennes de radio-télévision collectives, il devra se brancher sur ces installations collectives en supportant les frais de branchement et de prestation annuelle d’entretien.")
    doc.text("- En cas de vente des lieux loués, ou en cas de congé donné ou reçu, il devra, dans le dernier mois de la location, permettre l’accès au logement au bailleur ou son représentant.").br();

    doc.text("Article 13 - CLAUSE RÉSOLUTOIRE", { font: HelveticaBold }).br();
    doc.text("À défaut de paiement d'un seul mois de loyer à son échéance, ou des charges, ou en cas d'inexécution de l'une des clauses du bail, et 10 jours après une sommation de payer ou d'exécuter demeurée sans effet, le bail sera résilié de plein droit, si bon semble au bailleur, et sans formalité judiciaire.")
    doc.text("Il est prévu que le bail sera résilié de plein droit dans les cas suivants :").br();

    doc.text("1) défaut de paiement du loyer ou des charges aux termes convenus ou à défaut de versement du dépôt de garantie ;")
    doc.text("2) défaut d’assurance des risques locatifs par le Locataire ;")
    doc.text("3) troubles de voisinage constatés par une décision de justice et un mois après un commandement resté infructueux.")

    doc.text("Si le locataire refuse de quitter les lieux, il suffira, pour l'y contraindre, d'une ordonnance de référé rendue par le président du tribunal judiciaire de Paris.").br();

    doc.text("Article 14 : CLAUSE PÉNALE", { font: HelveticaBold }).br();
    doc.text("En outre, il est expressément convenu que tout mois de loyer non payé à son échéance, comme toutes charges ou frais non réglés dans les mêmes conditions seront, en vertu de l'article 1226 du code civil, majorés de 10 % à titre de clause pénale et ce, huit jours après l'envoi, par le bailleur, d'une lettre recommandée avec AR, réclamant le paiement et indiquant son intention de faire jouer la clause pénale, et ce, sans qu'il soit dérogé à la clause résolutoire précédemment énoncée et sans préjudice des dommages et intérêts que le bailleur pourrait être amené à réclamer en raison de la carence du locataire.").br();

    doc.text("Article 15 : FRAIS ET HONORAIRES", { font: HelveticaBold }).br();

    doc.text("Les honoraires et éventuels frais d'enregistrement des présentes sont supportés par le locataire qui s'y engage.").br();

    doc.text("Article 16 : TRAITEMENT DES DONNÉES À CARACTÈRE PERSONNEL", { font: HelveticaBold }).br();

    doc.text("Conformément à la loi n°78-17 du 6 janvier 1978 dans sa version en vigueur et au Règlement européen (UE) 2016/679, les Parties sont informées que le Mandataire procède au traitement des données à caractère personnel contenues dans le présent contrat. Le délégué à la protection des données (DPO) désigné au sein du cabinet/de l’agence étant Zacharias Guerari.")

    doc.text("Les données obtenues sont nécessaires pour l’exécution des missions du Mandataire telles que figurant au présent contrat et dans le respect des obligations découlant des articles 1100 et suivants du code civil, de la loi n° 70-9 du 2 janvier 1970 réglementant les conditions d’exercice des activités relatives à certaines opérations portant sur les immeubles et les fonds de commerce, son décret d’application n°72-678 du 20 juillet 1972 et des articles L.561-1 et suivants du code monétaire et financier relatifs à la lutte contre le blanchiment de capitaux et le financement du terrorisme. Ces données pourront être transmises à tout organisme de contrôle sur la demande de leur part.")

    doc.text("Elles seront conservées durant toute la durée de la relation commerciale et pendant une durée maximale de 5 ans à compter de la fin de la relation commerciale conformément à l’article 2224 du code civil et à l’article L561-12 du code monétaire et financier relatif à l’obligation de conservation des informations des clients dans le cadre de la lutte contre le blanchiment de capitaux et le financement du terrorisme. Les registres légaux tenus par le Cabinet/l’agence doivent être conservés pendant dix ans (articles 53, 65, et 72 du décret du 20 juillet 1972), les noms et adresses des mandants y figurant seront donc conservés durant toute cette durée.")

    doc.text("Les Parties sont informées qu’elles bénéficient d’un droit d’accès et de rectification de leurs données à caractère personnel traitées, qu’elles peuvent demander leur effacement, leur limitation et leur portabilité dans les conditions prévues aux articles 17, 18 et 20 du règlement européen (UE) 2016/679. Elles peuvent également exercer leur droit d’opposition dans les conditions prévues à l’article 21.")

    doc.text("Toute réclamation pourra être formulée auprès de la CNIL - 8 rue de Vivienne - 75083 PARIS cedex 02 – tel : 01 53 73 22 22 - www.cnil.fr").br().br();

    doc.text(
        `
  Le ${dayjs(result?.date_signature).format("DD/MM/YYYY") ?? ""}, à ${result?.lieu_signature ?? ""}`,
        {
            font: HelveticaBold,
        }
    );
    doc
        .text(
            `
  Signature du bailleur                                               Signature du locataire
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
                    ref: "api::contrats-residence-secondaire.contrats-residence-secondaire",
                    field: "contract",
                },
                files: {
                    path: tempPDF.name,
                    name: `contrat_residence_secondaire${result.locataire?.last_name ?? ""}${result?.contract_name}${"_" + dayjs(result.updatedAt).format("DD-MM-YYYY")
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
        console.log(event);
        // Fetch the logement with amenities
        const logementWithAmenities = await strapi.entityService.findOne("api::rent.rent", result.logement.id, {
            populate: {
                amenities: true,
            },
        });

        // Ensure result.object exists
        result.object = result.object || {};
        result.object.amenities = logementWithAmenities.amenities;

        console.log("amenities :", logementWithAmenities);
        loadPDFContract(result);
    },
    async beforeUpdate (event) {
        event.params.data.contract = null;
    },
    async afterUpdate (event) {
        const { result } = event;

        // Fetch the logement with amenities
        const logementWithAmenities = await strapi.entityService.findOne("api::rent.rent", result.logement.id, {
            populate: {
                amenities: true,
            },
        });

        // Ensure result.object exists
        result.object = result.object || {};
        result.object.amenities = logementWithAmenities.amenities;
        loadPDFContract(result);
    },
};
