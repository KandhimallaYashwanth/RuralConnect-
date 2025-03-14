
import { useState } from "react";
import { ChevronRight, Check, Clock, AlertTriangle } from "lucide-react";

const IssueTrackingDemo = () => {
  const [activeStep, setActiveStep] = useState(2);
  
  const steps = [
    { 
      id: 1, 
      title: "Issue Reported", 
      description: "You've reported an issue with road condition in Ward 5",
      icon: Check,
      status: "completed",
      date: "15 Jun 2023"
    },
    { 
      id: 2, 
      title: "Ward Member Review", 
      description: "Your issue is being reviewed by the Ward Member",
      icon: Clock,
      status: "active",
      date: "16 Jun 2023"
    },
    { 
      id: 3, 
      title: "Uppasarpanch Review", 
      description: "Issue will be forwarded to Uppasarpanch",
      icon: AlertTriangle,
      status: "pending",
      date: "Pending"
    },
    { 
      id: 4, 
      title: "Sarpanch Action", 
      description: "Final approval and action by Sarpanch",
      icon: AlertTriangle,
      status: "pending",
      date: "Pending"
    },
  ];

  return (
    <div className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Track Your Issues in Real-Time</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our transparent tracking system keeps you informed at every stage of the resolution process, 
            from initial reporting to final resolution.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rural-card bg-white p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Road Condition Issue</h3>
              <p className="text-gray-600">Reference ID: #RCI-2023-06-15</p>
            </div>
            <div className="issue-status issue-in-progress">In Progress</div>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="hidden md:block absolute left-[19px] top-8 h-[calc(100%-80px)] w-0.5 bg-gray-300"></div>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col md:flex-row items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10
                    ${step.status === "completed" ? "bg-rural-leaf" : 
                      step.status === "active" ? "bg-rural-mustard" : "bg-gray-200"}`}>
                    <step.icon className={`h-5 w-5 ${step.status === "pending" ? "text-gray-400" : "text-white"}`} />
                  </div>
                  
                  <div className="flex-grow pl-0 md:pl-4 pt-1">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <h4 className={`font-medium ${
                        step.status === "completed" ? "text-rural-leaf" : 
                        step.status === "active" ? "text-rural-earth" : "text-gray-400"
                      }`}>
                        {step.title}
                      </h4>
                      <span className="text-sm text-gray-500">{step.date}</span>
                    </div>
                    <p className={`mt-1 ${step.status === "pending" ? "text-gray-400" : "text-gray-600"}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
            <button className="btn-rural bg-gray-100 text-gray-600 hover:bg-gray-200">
              View Details
            </button>
            <button className="btn-rural btn-primary flex items-center gap-2">
              <span>Track Updates</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueTrackingDemo;
