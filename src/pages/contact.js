import React from "react";

import Layout from "../components/layout";
import Head from "../components/head"

const ContactPage = () => {
  return (
    <Layout>
      <Head title="Contact" />
      <h1>Contact</h1>
      <p>How to Contact >> <a href="mailto:kingman330@gmail.com">Mail me</a>!</p>
    </Layout>
  );
}

export default ContactPage;
