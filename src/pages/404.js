import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Head from "../components/head"

const NotFound = () => {
  return (
    <Layout>
      <Head title="404" />
      <h1>404</h1>
      <p>여긴 아무것도 없습니다!</p>
      <p>
        <Link to="/">메인으로 돌아가요.</Link>
      </p>
    </Layout>
  )
}

export default NotFound