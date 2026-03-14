# Project Name: Trello Clone (Kanban)

## 🛠 Installation Rapide
1. **Backend / Strapi:**
   - Ouvrez le dossier `backend` dans un terminal.
   - Tapez `npm install`
   - Tapez `npm run build`
   - Tapez `npm run dev`

2. **Frontend :**
   - Ouvrir le dossier `frontend` dans un terminal.
   - Taper `npm install`
   - Taper `npm run dev`

## 🔑 Accès Admin Strapi
- **URL :** http://localhost:1337/admin
- **Email :** cemsahozdemirel791@gmail.com 
- **Password :**  Kedyadam2621*


> **Important**
> Pour faciliter le contrôle du projet, j'ai volontairement laissé les éléments suivants :
>
> 1. **Fichier `.env` :** Présent dans le dossier backend mais je l'ai quand meme mis dans le dossier "documentation".
> 2. **Dossier `node_modules` :** Les librairies ne sont pas supprimées pour vous éviter un téléchargement long. Vous pouvez lancer le projet directement.


---

## 🛠️ Choix techniques
**React :**
-Premièrement, en tant qu'étudiants qui sont en recherche de stages etc., c'était le choix paraissant le meilleur possible.
-Comme nous avions un temps limité, nous avons fait des recherches sur les frameworks et nous avons vu qu'Angular et Vue étaient plus compliqué à apprendre que React.
-Et finalement, la flexibilité de JSX permet de manipuler la structure HTML directement en JavaScript, parce qu'au bout d'un moment, si le HTML est compliqué, il devient assez difficile et chaotique en utilisant Vue et Angular.

**dnd-kit :** facile et efficace, exactement ce qu'il nous fallait pour faire la logique de kanban et même c'était recommandé par vous.
**React Hot Toast :**  Comparé aux autres librairies comme react-toastify etc., il est plus facile à utiliser, moderne au niveau du design et plus performant.

## 🛠️ Guide utilisateur


**Se connecter / S'inscrire**
Si vous n'avez pas de compte, cliquez sur "S'inscrire" qui est en bas et saisissez vos informations. Ensuite, vous pouvez revenir à la page de connexion en cliquant sur "Connexion" qui se trouve au même endroit que "S'inscrire". Si jamais vous cochez "Se souvenir de moi", tant que vous ne vous déconnectez pas, vous allez rester connecté.

**Les parametres personalisé**
En cliquant sur la photo de profil située tout en haut à droite, on peut accéder aux paramètres personnalisés. Il est possible de changer le fond d'écran, le pseudo, la photo de profil et la couleur des colonnes. Pour faire ça, il suffit de choisir les options que vous voulez et d'appuyer sur "Appliquer", ou "Annuler" si jamais vous changez d'idée. Et bien sûr, en cliquant sur l'icône du soleil ou de la lune, vous pouvez changer le thème. Il y a également un bouton de déconnexion pour se déconnecter.

**Les Tableau**
Une fois que vous vous êtes connecté, vous devrez commencer par créer votre premier tableau. Vous allez voir que tout en haut à gauche, il y a "Créer un tableau". Cliquez dessus et cliquez sur "le plus" sur le panel descendu ; comme ça, vous aurez un tableau. (pour fermer le panel il faudrait faire la clicquer encore une fois) Si vous voulez changer son nom ou bien le supprimer, vous êtes obligé de créer un autre tableau, parce que faire des changements sur le tableau actif n'est malheureusement pas possible. Mais quand vous en avez au moins deux, vous allez voir que c'est possible de le supprimer en cliquant sur "le coche" et de le renommer en cliquant sur "l'icon de papier". Et bien sûr, pour changer entre les tableaux, il faut juste appuyer dessus. Et n'oubliez pas : vous pouvez avoir 10 tableaux au max.


**Les Column**
Une fois que vous avez créé un tableau, vous pouvez commencer à créer votre première colonne. Vous allez voir "une icône de plus" juste à côté de la phrase "Aucune colonne créée. Cliquez sur le bouton "+" pour commencer." Cliquez dessus, et après, en cliquant sur les trois points, vous pouvez supprimer et renommer votre colonne. Pour fermer le panel descendu, il faudrait cliquer sur "la coche rouge". Vous pouvez également changer l'ordre des colonnes comme vous voulez en glissant une colonne sur une autre.

**Les Cartes**
Une fois que vous avez créé une colonne, vous pouvez commencer vos tâches. Vous allez voir "Ajouter une carte". Cliquez dessus, et après, en cliquant sur la carte, vous pouvez supprimer, renommer votre carte et ajouter une date d'échéance ainsi qu'une étiquette. Vous pouvez également changer l'ordre des cartes comme vous voulez en glissant une carte sur une autre. Et bien sûr, pour supprimer la carte, il suffit de cliquer sur "la coche rouge".
