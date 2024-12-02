import EmblaCarousel from "./js/embla-carousel";
import { EmblaOptionsType } from "embla-carousel";
import { v4 as uuidv4 } from "uuid";

import "./css/sandbox.css";
import "./css/embla.css";

interface Person {
  id: string;
  position: string;
  name: string;
  bio: string;
  video: string;
  trait: string;
  birthdate: string;
}

const people: Person[] = [
  {
    id: uuidv4(),
    position: "Founder",
    name: "Alvin",
    bio: "Alvin is a founder",
    video: "/members/alvin.mp4",
    trait: "Calm",
    birthdate: "1990-01-01",
  },
  {
    id: uuidv4(),
    position: "Co-Founder",
    name: "Ben",
    bio: "Ben is a co-founder",
    video: "/members/ben.mp4",
    trait: "Creative",
    birthdate: "1991-01-01",
  },
  {
    id: uuidv4(),
    position: "CTO",
    name: "Ross",
    bio: "Ross is a CTO",
    video: "/members/ross.mp4",
    trait: "Analytical",
    birthdate: "1992-01-01",
  },
  {
    id: uuidv4(),
    position: "Founder",
    name: "Alvin",
    bio: "Alvin is a founder",
    video: "/members/alvin.mp4",
    trait: "Calm",
    birthdate: "1990-01-01",
  },
  {
    id: uuidv4(),
    position: "Co-Founder",
    name: "Ben",
    bio: "Ben is a co-founder",
    video: "/members/ben.mp4",
    trait: "Creative",
    birthdate: "1991-01-01",
  },
  {
    id: uuidv4(),
    position: "CTO",
    name: "Ross",
    bio: "Ross is a CTO",
    video: "/members/ross.mp4",
    trait: "Analytical",
    birthdate: "1992-01-01",
  },
];

export default function Page() {
  return <EmblaCarousel people={people} options={{ loop: true }} />;
}
