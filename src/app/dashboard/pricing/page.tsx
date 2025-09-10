import React from "react";
import { TOTLAL_WORDS } from "../_components/UpgradeTrack";

const plans = [
  {
    name: "Pro",
    price: 9.99,
    features: [
      "Unlimited Words",
      "5GB of storage",
      "Email support",
      "Help center access",
 
    ],
    isFree: false,
    borderColor: "border-mainColor",
    backgroundColor: "bg-mainColor",
    textColor: "text-white",
    hoverRingColor: "hover:ring-mainColor",
    textHoverColor: "hover:text-mainColor",
  },
  {
    name: "Starter",
    price: "10",
    features: [
      `40000 Words`,
      "1GB of storage",
      "Email support"
    ],
    isFree: true,
    borderColor: "border-gray-200",
    backgroundColor: "bg-white",
    textColor: "text-mainColor",
    hoverRingColor: "hover:ring-mainColor",
    textHoverColor: "hover:text-mainColor",
  },
];

const Pricing = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 bg-slate-100">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-2xl border ${plan.borderColor} p-6 shadow-sm ring-1 ${plan.borderColor} sm:px-8 lg:p-12`}
          >
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                {plan.name}
                <span className="sr-only">Plan</span>
              </h2>
              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {plan.isFree ? "Free" : `$${plan.price}`}
                </strong>
                <span className="text-sm font-medium text-gray-700">/month</span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-mainColor-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#"
              className={`mt-8 block rounded-full border ${plan.borderColor} ${plan.backgroundColor} px-12 py-3 text-center text-sm font-medium ${plan.textColor} ${plan.hoverRingColor} focus:outline-none focus:ring active:${plan.textHoverColor}`}
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
