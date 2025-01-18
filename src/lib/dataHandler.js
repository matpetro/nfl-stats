import rushing from "@/rushing.json"

function getData(sortAttrib, order, search){
    let rushingData = [...rushing]

    // When searching for player, make sure all players included have the search term in their name
    if (search) {
        rushingData = rushingData.filter(item => 
            item.Player.toLowerCase().includes(search.toLowerCase())
        )
    }

    // sort the data using a custom sort function (neg- a comes first, pos- b comes first)
    rushingData.sort((a, b) => {
        // get the values for what ever attribute user selected
        let aValue = a[sortAttrib]
        let bValue = b[sortAttrib]
        
        if (sortAttrib === 'Lng') {
            // deal with possible T in longest rush so that can just be compared on distance
            // also deal with the mix of strings and ints at this value
            aValue = typeof aValue === 'string' ? parseInt(aValue.replace('T', '')) : aValue
            bValue = typeof bValue === 'string' ? parseInt(bValue.replace('T', '')) : bValue
        } else if (sortAttrib === 'Yds') {
            // deal with commas in number strings to avoid Nan
            aValue = typeof aValue === 'string' && aValue.includes(',') ? parseInt(aValue.replace(',', '')) : aValue
            bValue = typeof bValue === 'string' && bValue.includes(',') ? parseInt(bValue.replace(',', '')) : bValue
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            // compare strings
            return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        // compare numbers
        // subtraction will deal with the string numbers that are sprinkled into the data
        return order === 'asc' ? aValue - bValue : bValue - aValue
    })

    return rushingData
}

export function getPageData(page, limit, sortAttrib, order, search){
    // get sorted and filtered data
    let data = getData(sortAttrib, order, search)

    // return the data needed for the current page of the table
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const paginatedData = data.slice(startIndex, endIndex)

    return { data: paginatedData, total: data.length}
}

export function createCSVofData(sortAttrib, order, search){
    // get sorted and filtered data
    let data = getData(sortAttrib, order, search)

    // Convert each object in the JSON data to a CSV string
    const headers = Object.keys(data[0]);
    // Must remove any existing commas in the string
    const rows = data.map(item =>
        headers.map(header => 
            typeof item[header] === 'string' ? item[header].replace(',', '') : item[header])
            .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    
    return csv;
}

