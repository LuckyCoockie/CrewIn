import React from "react";
import CrewListComponent from "../components/molecules/CrewListMolecule";

const data = [
  {
    imageUrl: "https://picsum.photos/200",
    title: "Sample Title",
    description: "This is a sample description for the card component.",
    captain: "John Doe",
    location: "Seoul, South Korea",
    peopleCount: 5,
  },
  {
    imageUrl: "https://picsum.photos/200",
    title: "Sample Title",
    description: "This is a sample description for the card component.",
    captain: "John Doe",
    location: "Seoul, South Korea",
    peopleCount: 5,
  },
  {
    imageUrl: "https://picsum.photos/200",
    title: "Sample Title",
    description: "This is a sample description for the card component.",
    captain: "John Doe",
    location: "Seoul, South Korea",
    peopleCount: 5,
  },
  {
    imageUrl: "https://picsum.photos/200",
    title: "Sample Title",
    description: "This is a sample description for the card component.",
    captain: "John Doe",
    location: "Seoul, South Korea",
    peopleCount: 5,
  },
  {
    imageUrl: "https://picsum.photos/200",
    title: "Sample Title",
    description: "This is a sample description for the card component.",
    captain: "John Doe",
    location: "Seoul, South Korea",
    peopleCount: 5,
  },
  {
    imageUrl: "https://picsum.photos/200",
    title: "Sample Title",
    description: "This is a sample description for the card component.",
    captain: "John Doe",
    location: "Seoul, South Korea",
    peopleCount: 5,
  },
  {
    imageUrl: "https://picsum.photos/200",
    title: "Sample Title",
    description: "This is a sample description for the card component.",
    captain: "John Doe",
    location: "Seoul, South Korea",
    peopleCount: 5,
  },
];

const CrewPage: React.FC = () => {
  return <CrewListComponent dataList={data} />;
};

export default CrewPage;
