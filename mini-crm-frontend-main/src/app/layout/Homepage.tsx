const features = [
  {
    title: "Easy Integration",
    description:
      "Seamlessly integrate with your existing tools for a smooth experience. Our platform works with popular software to enhance your workflow without disruption.",
  },
  {
    title: "24/7 Customer Support",
    description:
      "Our team is here to assist you around the clock, ensuring you never feel alone. Whether it's a quick question or a complex issue, we're just a message away.",
  },
  {
    title: "Customizable Solutions",
    description:
      "Tailored solutions that fit your unique business needs and workflows. We provide a variety of options to ensure our CRM works for you, not the other way around.",
  },
  {
    title: "Data Analytics",
    description:
      "Gain insights into customer behavior and sales trends with our powerful analytics tools. Make informed decisions that drive growth and improve customer satisfaction.",
  },
  {
    title: "Mobile Access",
    description:
      "Access your CRM on the go with our mobile-friendly platform. Stay connected and manage customer relationships from anywhere, anytime.",
  },
  {
    title: "Secure Data",
    description:
      "Your data security is our top priority. We use industry-standard encryption to keep your information safe. Trust us to protect your customer relationships and business data.",
  },
];

const Homepage = () => {
  return (
    <section className="flex flex-col size-full">
      <div className="bg-white text-gray-800 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="xl:text-6xl 2xl:text-7xl font-extrabold mb-4">Welcome to Xeno-CRM</h1>
          <p className="text-lg mb-8">
            Your go-to solution for managing customer relationships effectively.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className="py-20 px-3.5 sm:px-10 bg-sidebar-primary-foreground rounded-xl"
      >
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 col-span-1 rounded-lg shadow-md hover:shadow-lg hover:invert filter transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
