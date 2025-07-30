import { CustomerWithSites, Site } from "../types";
import { Button } from "../../../components/ui/Button";
import { PlusCircle } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { Link } from "react-router-dom";

interface ProjectListProps {
  customers: CustomerWithSites[];
  onEditClick: (site: Site) => void; 
}

export function ProjectList({ customers, onEditClick  }: ProjectListProps) {
  return (
    <div className="mt-8 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-text-primary">
          My Projects
        </h2>
        <Link to="/create-project">
        <Button className="rounded-full">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Project
        </Button>
        </Link>
      </div>
 <div className="mt-0 border-b border-gray-200"></div>
      {customers.map(({ customer, sites }) => (
        <div key={customer.id}>
                      <div className="mb-4">

          <h3 className="font-bold text-lg text-brand-text-primary">
            {customer.name}
          </h3>
                      </div>
          {sites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => (
                <ProjectCard key={site.id} site={site}  onEditClick={onEditClick}/>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No sites found for this customer.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
