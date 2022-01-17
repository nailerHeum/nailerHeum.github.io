import React from "react";

import Layout from "../components/layout";
import Head from "../components/head"

import * as ContactStyle from "./contact.module.scss";

const ContactPage = () => {
  return (
    <Layout>
      <Head title="Contact" />
      <h1>Contact</h1>
      <div className={ContactStyle.content}>
        <p><a href="mailto:kingman330@gmail.com">kingman330@gmail.com</a></p>
      </div>
    </Layout>
  );
}

export default ContactPage;
