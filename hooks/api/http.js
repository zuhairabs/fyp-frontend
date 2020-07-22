import React from 'react'
import { useState } from "react"

export const useHttp = ({}) => {
    const [loading, setLoading] = useState();
    const [fetchedData, setFetchedData] = useState();

    const options = {}

    // fetch(url, options)
    // .then(res=>{
    //     if(res)
    // })

}