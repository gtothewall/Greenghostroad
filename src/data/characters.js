import miaBadge from "../assets/characters/mia-badge.png";
import miaPose from "../assets/characters/mia-pose.png";
import echoBadge from "../assets/characters/echo-badge.png";
import echoPose from "../assets/characters/echo-pose.png";
import kingBadge from "../assets/characters/king-badge.png";
import kingPose from "../assets/characters/king-pose.png";
import chaceBadge from "../assets/characters/chace-badge.png";
import chacePose from "../assets/characters/chace-pose.png";
import hopeBadge from "../assets/characters/hope-badge.png";
import hopePose from "../assets/characters/hope-pose.png";

import megaBadge from "../assets/characters/mega-badge.png";
import megaPose from "../assets/characters/mega-pose.png";
import humBadge from "../assets/characters/hum-badge.png";
import humPose from "../assets/characters/hum-pose.png";
import finxBadge from "../assets/characters/finx-badge.png";
import finxPose from "../assets/characters/finx-pose.png";
import dashBadge from "../assets/characters/dash-badge.png";
import dashPose from "../assets/characters/dash-pose.png";
import wishBadge from "../assets/characters/wish-badge.png";
import wishPose from "../assets/characters/wish-pose.png";

export const CHARACTERS = [
  {
    id: "mia",
    name: "Mia",
    tag: "MIA",
    species: "Vampire",
    natural: "Space",
    hiphop: "DJing",
    primary: "#A78BFA",
    secondary: "#FF3B3B",
    img: miaBadge,
    pose: miaPose,
    blurb: "Spins the six directions like tracks on a turntable.",
    pet: {
      id: "mega",
      name: "Mega",
      species: "Bat",
      sense: "Sound",
      img: megaBadge,
      pose: megaPose,
      blurb: "Hears the whole world through sound waves and echoes.",
    },
  },
  {
    id: "echo",
    name: "Echo",
    tag: "ECHO",
    species: "Ghost",
    natural: "Air",
    hiphop: "MCing",
    primary: "#3DFF57",
    secondary: "#FF2E88",
    img: echoBadge,
    pose: echoPose,
    blurb: "Turns breath control into bars that never run out of air.",
    pet: {
      id: "hum",
      name: "Hum",
      species: "Bumblebee",
      sense: "Touch",
      img: humBadge,
      pose: humPose,
      blurb: "Feels every breeze and buzz with the tiniest hairs.",
    },
  },
  {
    id: "king",
    name: "King",
    tag: "KING",
    species: "Mummy",
    natural: "Fire",
    hiphop: "Graffiti",
    primary: "#5B9BFF",
    secondary: "#FFD98F",
    img: kingBadge,
    pose: kingPose,
    blurb: "Tags the wall in colors as hot as a fresh flame.",
    pet: {
      id: "finx",
      name: "Finx",
      species: "Tabby cat",
      sense: "Sight",
      img: finxBadge,
      pose: finxPose,
      blurb: "Spots every detail, even in the dimmest light.",
    },
  },
  {
    id: "chace",
    name: "Chace",
    tag: "CHACE",
    species: "Werewolf",
    natural: "Earth",
    hiphop: "Breaking",
    primary: "#FF4D4D",
    secondary: "#29B6FF",
    img: chaceBadge,
    pose: chacePose,
    blurb: "Freezes and flips using nothing but earth's own physics.",
    pet: {
      id: "dash",
      name: "Dash",
      species: "Wolf pup",
      sense: "Smell",
      img: dashBadge,
      pose: dashPose,
      blurb: "Follows a scent trail farther than anyone else in the crew.",
    },
  },
  {
    id: "hope",
    name: "Hope",
    tag: "HOPE",
    species: "Witch",
    natural: "Water",
    hiphop: "Knowledge",
    primary: "#7CE8A4",
    secondary: "#8577C2",
    img: hopeBadge,
    pose: hopePose,
    blurb: "Carries wisdom the way water carries a river downstream.",
    pet: {
      id: "wish",
      name: "Wish",
      species: "Frog",
      sense: "Taste",
      img: wishBadge,
      pose: wishPose,
      blurb: "Knows a good flavor faster than anyone in the crew.",
    },
  },
];

export const ALL_ENTITIES = CHARACTERS.flatMap((c) => [
  { id: c.id, name: c.name, primary: c.primary, img: c.img },
  { id: c.pet.id, name: c.pet.name, primary: c.secondary, img: c.pet.img },
]);

export function entityById(id) {
  return ALL_ENTITIES.find((e) => e.id === id);
}

export function charById(id) {
  return (
    CHARACTERS.find((c) => c.id === id) ||
    CHARACTERS.find((c) => c.pet.id === id)
  );
}
