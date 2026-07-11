import { useParams } from "react-router-dom";
export default function ProjectDetail() {
  const { slug } = useParams();
  return <div className="min-h-screen flex items-center justify-center">Projet : {slug}</div>;
}