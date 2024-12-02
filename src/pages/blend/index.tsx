import { v4 as uuidv4 } from "uuid";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface Person {
  id: string;
  position: string;
  name: string;
  bio: string;
  video: string;
  trait: string;
  birthdate: string;
}

export default function Blend() {
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

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-[768px] will-change-transform">
          {people.map((person) => (
            <div className="relative h-full" key={person.id}>
              <video autoPlay muted loop className="h-full mix-blend-multiply">
                <source src={person.video} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
