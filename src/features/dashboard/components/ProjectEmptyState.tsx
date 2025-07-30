import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/button';

export function ProjectEmptyState() {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-brand-text-primary mb-4">My Projects</h2>
        <Card className="text-center py-16 border-dashed bg-[#F9FAFF] ">

        <p className="text-brand-text-secondary mb-4">You don't have any projects yet. Let's create your first one!</p>
         <Link to="/create-project">
         <Button className="rounded-full">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Project
        </Button>
        </Link>
      </Card>
    </div>
  );
}