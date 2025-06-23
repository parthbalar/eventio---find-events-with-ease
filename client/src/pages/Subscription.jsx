import { useState, useEffect } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPage() {
    const [userEmail, setUserEmail] = useState("");
    const [isMonthly, setIsMonthly] = useState(true);
    const navigate = useNavigate();

    const plans = {
        monthly: [
            { name: "VIP", price: "$99 / month", color: "emerald", features: ["Unlimited Access", "24/7 Support", "Exclusive Content"] },
            { name: "Premium", price: "$49 / month", color: "cyan", features: ["Premium Access", "Priority Support", "Limited Content"] },
            { name: "Standard", price: "$19 / month", color: "amber", features: ["Basic Access", "Email Support", "Free Content"] },
        ],
        yearly: [
            { name: "VIP", price: "$999 / year", color: "emerald", features: ["Unlimited Access", "24/7 Support", "Exclusive Content"] },
            { name: "Premium", price: "$499 / year", color: "cyan", features: ["Premium Access", "Priority Support", "Limited Content"] },
            { name: "Standard", price: "$199 / year", color: "amber", features: ["Basic Access", "Email Support", "Free Content"] },
        ],
    };

    const colorMap = {
        emerald: { bg: "bg-emerald-500", hover: "hover:bg-emerald-600", text: "text-emerald-500", border: "border-emerald-400" },
        cyan: { bg: "bg-cyan-500", hover: "hover:bg-cyan-600", text: "text-cyan-500", border: "border-cyan-400" },
        amber: { bg: "bg-amber-500", hover: "hover:bg-amber-600", text: "text-amber-500", border: "border-amber-400" },
    };

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (email) {
            setUserEmail(email);
        }
    }, []);

    const handleToggle = (planType) => {
        setIsMonthly(planType === "monthly");
    };

    const handlePlanClick = (plan) => {
        navigate("/checkoutform", {
            state: {
                email: userEmail,
                plan: plan.name,
                price: plan.price,
            },
        });
    };

    return (
        <div className="max-w-screen-xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Choose Your Subscription Plan</h1>

            <div className="flex justify-center space-x-8 mb-8">
                <button
                    onClick={() => handleToggle("monthly")}
                    className={`${isMonthly ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"} py-2 px-6 rounded-full font-semibold hover:bg-emerald-600 transition-all`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => handleToggle("yearly")}
                    className={`${!isMonthly ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"} py-2 px-6 rounded-full font-semibold hover:bg-emerald-600 transition-all`}
                >
                    Yearly
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(isMonthly ? plans.monthly : plans.yearly).map((plan, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-2xl shadow-lg ${colorMap[plan.color].border} border-t-[8px] transition transform hover:scale-105 duration-300 p-8 flex flex-col justify-between min-h-[320px] hover:shadow-2xl`}
                    >
                        <p className={`text-3xl font-bold ${colorMap[plan.color].text} mb-6`}>{plan.price}</p>

                        <ul className="flex flex-col gap-4 mb-6">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-lg">
                                    <IoMdCheckmarkCircle className="text-green-500 w-6 h-6 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handlePlanClick(plan)} 
                            className={`mt-auto ${colorMap[plan.color].bg} ${colorMap[plan.color].hover} text-white font-semibold py-3 px-6 rounded-xl transition-all`}
                        >
                            Subscribe Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
