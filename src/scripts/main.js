/* eslint no-console: 0, comma-dangle: 0, no-restricted-syntax: 0, guard-for-in: 0, max-len: 0, object-curly-newline: 0  */
/* global $, math */

// todo: refactor into one object

const dilutions = {
  fentanyl: 50,
  propofol: 10,
  atracurium: 10,
  ondansetron: 2,
  morphine: 10,
  dexamethasone: 3.3,
  paracetamol: 10,
  thiopentone: 25,
  rocuronium: 10,
  atropine: 600,
  suxamethonium: 50,
}

const maxDoses = {
  fentanyl: 0,
  propofol: 0,
  atracurium: 0,
  ondansetron: 4,
  morphine: 0,
  dexamethasone: 6.6,
  paracetamol: 1000,
  thiopentone: 0,
  rocuronium: 0,
  atropine: 600,
  suxamethonium: 0,
}

const doses = {
  fentanyl: 1,
  propofol: 3,
  atracurium: 0.5,
  ondansetron: 0.15,
  morphine: 0.1,
  dexamethasone: 0.15,
  paracetamol: 15,
  thiopentone: 5,
  rocuronium: 0.6,
  atropine: 20,
  suxamethonium: 1.5,
}

const units = {
  fentanyl: 'mcg',
  propofol: 'mg',
  atracurium: 'mg',
  ondansetron: 'mg',
  morphine: 'mg',
  dexamethasone: 'mg',
  paracetamol: 'mg',
  thiopentone: 'mg',
  rocuronium: 'mg',
  atropine: 'mcg',
  suxamethonium: 'mg',
}

const custom = {
  fentanyl: false,
  propofol: false,
  atracurium: false,
  ondansetron: false,
  morphine: false,
  dexamethasone: false,
  paracetamol: false,
  thiopentone: false,
  rocuronium: false,
  atropine: false,
  suxamethonium: false,
}

const customDilutions = {
  fentanyl: { dilute: 100, unit: 'mcg', vol: 2, dilutant: 0 },
  propofol: { dilute: 200, unit: 'mg', vol: 20, dilutant: 0 },
  atracurium: { dilute: 50, unit: 'mg', vol: 5, dilutant: 0 },
  ondansetron: { dilute: 4, unit: 'mg', vol: 2, dilutant: 0 },
  morphine: { dilute: 10, unit: 'mg', vol: 10, dilutant: 1 },
  dexamethasone: { dilute: 6.6, unit: 'mg', vol: 2, dilutant: 0 },
  paracetamol: { dilute: 1000, unit: 'mg', vol: 100, dilutant: 0 },
  thiopentone: { dilute: 500, unit: 'mg', vol: 20, dilutant: 2 },
  rocuronium: { dilute: 50, unit: 'mg', vol: 5, dilutant: 0 },
  atropine: { dilute: 600, unit: 'mcg', vol: 1, dilutant: 0 },
  suxamethonium: { dilute: 100, unit: 'mg', vol: 2, dilutant: 0 },
}

const defaultDilutions = {
  fentanyl: { dilute: 100, unit: 'mcg', vol: 2, dilutant: 0 },
  propofol: { dilute: 200, unit: 'mg', vol: 20, dilutant: 0 },
  atracurium: { dilute: 50, unit: 'mg', vol: 5, dilutant: 0 },
  ondansetron: { dilute: 4, unit: 'mg', vol: 2, dilutant: 0 },
  morphine: { dilute: 10, unit: 'mg', vol: 10, dilutant: 1 },
  dexamethasone: { dilute: 6.6, unit: 'mg', vol: 2, dilutant: 0 },
  paracetamol: { dilute: 1000, unit: 'mg', vol: 100, dilutant: 0 },
  thiopentone: { dilute: 500, unit: 'mg', vol: 20, dilutant: 2 },
  rocuronium: { dilute: 50, unit: 'mg', vol: 5, dilutant: 0 },
  atropine: { dilute: 600, unit: 'mcg', vol: 1, dilutant: 0 },
  suxamethonium: { dilute: 100, unit: 'mg', vol: 2, dilutant: 0 },
}

const formatResults = (results) => {
  for (const prop in results) {
    if (results[prop].dose > 0) {
      $(`.${prop}.dose`).html(`${results[prop].dose} ${units[prop]}<br><small>[${doses[prop]} ${units[prop]}/kg]</small>`)
    } else {
      $(`.${prop}.dose`).text('')
    }
    if (results[prop].volume > 0) {
      $(`.${prop}.volume`).text(`${results[prop].volume} ml`)
    } else {
      $(`.${prop}.volume`).text('')
    }
  }
}

const formatDilutions = () => {
  let sol = ''
  for (const prop in dilutions) {
    if (custom[prop] === true) {
      if (customDilutions[prop].dilutant === 1) { sol = '0.9% NaCl' }
      if (customDilutions[prop].dilutant === 2) { sol = 'water' }
      $(`#${prop}Dil`).text(`${customDilutions[prop].dilute}${customDilutions[prop].unit} in ${customDilutions[prop].vol}ml of ${sol}`)
      $(`#${prop}Dilution`).text(`${math.format(math.divide(customDilutions[prop].dilute, customDilutions[prop].vol), { precision: 2 })}...${units[prop]}/ml`)
    } else {
      if (defaultDilutions[prop].dilutant === 1) { sol = '0.9% NaCl' }
      if (defaultDilutions[prop].dilutant === 2) { sol = 'water' }
      $(`#${prop}Dil`).text(`${defaultDilutions[prop].dilute}${defaultDilutions[prop].unit} in ${defaultDilutions[prop].vol}ml of ${sol}`)
      $(`#${prop}Dilution`).text(`${math.format(math.divide(defaultDilutions[prop].dilute, defaultDilutions[prop].vol), { precision: 2 })}...${units[prop]}/ml`)
    }
    if (customDilutions[prop].dilutant === 0) { $(`#${prop}Dil`).text('neat') }
  }
}

const calculate = (weight) => {
  const results = {
    fentanyl: { dose: 0, volume: 0 },
    propofol: { dose: 0, volume: 0 },
    atracurium: { dose: 0, volume: 0 },
    ondansetron: { dose: 0, volume: 0 },
    morphine: { dose: 0, volume: 0 },
    dexamethasone: { dose: 0, volume: 0 },
    paracetamol: { dose: 0, volume: 0 },
    thiopentone: { dose: 0, volume: 0 },
    rocuronium: { dose: 0, volume: 0 },
    atropine: { dose: 0, volume: 0 },
    suxamethonium: { dose: 0, volume: 0 },
  }
  for (const prop in results) {
    results[prop].dose = math.format(math.multiply(doses[prop], weight), { precision: 14 })
    // check for max doses
    if (maxDoses[prop] > 0 && results[prop].dose > maxDoses[prop]) { results[prop].dose = maxDoses[prop] }
    if (custom[prop] === false) {
      results[prop].volume = math.format(math.chain(results[prop].dose).divide(defaultDilutions[prop].dilute).multiply(defaultDilutions[prop].vol).done(), { precision: 2 })
    } else {
      results[prop].volume = math.format(math.chain(results[prop].dose).divide(customDilutions[prop].dilute).multiply(customDilutions[prop].vol).done(), { precision: 2 })
    }
  }
  return results
}

const clearData = () => {
  const results = {
    fentanyl: { dose: 0, volume: 0 },
    propofol: { dose: 0, volume: 0 },
    atracurium: { dose: 0, volume: 0 },
    ondansetron: { dose: 0, volume: 0 },
    morphine: { dose: 0, volume: 0 },
    dexamethasone: { dose: 0, volume: 0 },
    paracetamol: { dose: 0, volume: 0 },
    thiopentone: { dose: 0, volume: 0 },
    rocuronium: { dose: 0, volume: 0 },
    atropine: { dose: 0, volume: 0 },
    suxamethonium: { dose: 0, volume: 0 },
  }
  formatResults(results)
}

const guessWeight = () => {
  const age = parseInt($('#inlineFormInput2').val(), 10)
  let valid = false
  if (age.toString().length === $('#inlineFormInput2').val().length) { valid = true }
  if (valid === true && age > 0 && age < 17) {
    let weight = 0
    // APLS (current) for age 0 - 12
    if (age === 1) { weight = math.format(math.chain(age).divide(2).add(4).done(), { precision: 3 }) }
    if (age > 1 && age < 6) { weight = math.format(math.chain(age).multiply(2).add(8).done(), { precision: 3 }) }
    if (age > 5 && age < 14) { weight = math.format(math.chain(age).multiply(3).add(7).done(), { precision: 3 }) }
    // APLS (old) for 13-16
    if (age > 13) { weight = math.format(math.chain(age).add(4).multiply(2).done(), { precision: 3 }) }
    console.log(weight)
    $('#est').text(`[est: ${weight} kg]`)
    return true
  }
  $('#est').text('')
  return false
}

const showOrHideCustom = () => {
  if ($('#customSwitch1').prop('checked') === true) {
    $('#customDilutionForm').hide()
  } else {
    $('#customDilutionForm').show()
  }
}

const setupDilutionsDialog = (drug) => {
  $('#modalT').text(`${drug} dilution`)
  const drugLower = drug.toLowerCase()
  $('#unitsAppendConc').text(units[drugLower])
  $('#customSwitch1').prop('checked', !(custom[drugLower]))
  $('#dilution1').val(customDilutions[drugLower].dilute)
  $('#dilution2').val(customDilutions[drugLower].vol)
  if (customDilutions[drugLower].dilutant === 1) {
    $('#customRadio2').prop('checked', false)
    $('#customRadio1').prop('checked', true)
    $('#customRadio0').prop('checked', false)
  }
  if (customDilutions[drugLower].dilutant === 0) {
    $('#customRadio2').prop('checked', false)
    $('#customRadio1').prop('checked', false)
    $('#customRadio0').prop('checked', true)
  }
  if (customDilutions[drugLower].dilutant === 2) {
    $('#customRadio2').prop('checked', true)
    $('#customRadio1').prop('checked', false)
    $('#customRadio0').prop('checked', false)
  }
  if (custom[drugLower] === true) {
    $('#customSwitch1').prop('checked', false)
  } else {
    $('#customSwitch1').prop('checked', true)
  }
  if (drugLower === 'morphine' || drugLower === 'atropine') {
    $('#unitsAppendConc').removeClass('disabled')
  } else {
    $('#unitsAppendConc').addClass('disabled')
  }
  showOrHideCustom()
}

const toggleUnits = () => {
  const drug = $('#modalT').text().replace(/ .*/, '')
  const drugLower = drug.toLowerCase()
  console.log(drugLower)
  if (drugLower === 'morphine' || drugLower === 'atropine') {
    if ($('#unitsAppendConc').text() === 'mg') {
      $('#unitsAppendConc').text('mcg')
      units[drugLower] = 'mcg'
    } else {
      $('#unitsAppendConc').text('mg')
      units[drugLower] = 'mg'
    }
  }
  // do this on save: formatDilutions()
}

const calcConc = (drug) => {
  dilutions[drug] = math.format(math.divide(customDilutions[drug].dilute, customDilutions[drug].vol), { precision: 2 })
}

const saveCustom = () => {
  const drug = $('#modalT').text().replace(/ .*/, '')
  const drugLower = drug.toLowerCase()
  if ($('#customSwitch1').prop('checked') === false) {
    custom[drugLower] = true
    // get units
    if ($('#unitsAppendConc').text() === 'mg') {
      units[drugLower] = 'mg'
    } else {
      units[drugLower] = 'mcg'
    }
    // and volumes
    // suxamethonium: { dilute: 100, unit: 'mg', vol: 2, dilutant: 0 },
    customDilutions[drugLower].vol = parseInt($('#dilution2').val(), 10)
    customDilutions[drugLower].dilute = parseInt($('#dilution1').val(), 10)
    customDilutions[drugLower].unit = units[drugLower]
    if ($('#customRadio2').prop('checked') === true) {
      customDilutions[drugLower].dilutant = 2
    }
    if ($('#customRadio1').prop('checked') === true) {
      customDilutions[drugLower].dilutant = 1
    }
    if ($('#customRadio0').prop('checked') === true) {
      customDilutions[drugLower].dilutant = 0
    }
  } else {
    custom[drugLower] = false
    customDilutions[drugLower].dilutant = defaultDilutions[drugLower].dilutant
    customDilutions[drugLower].vol = defaultDilutions[drugLower].vol
    customDilutions[drugLower].dilute = defaultDilutions[drugLower].dilute
    customDilutions[drugLower].unit = defaultDilutions[drugLower].unit
    // console.log(customDilutions[drugLower])
  }
  calcConc(drugLower)
  clearData()
  formatDilutions()
  $('#editModal').modal('hide')
}

$(document).ready(() => {
  // setup events
  $('#calc').click((e) => {
    e.preventDefault()
    const results = calculate($('#inlineFormInput').val())
    formatResults(results)
    // console.log(results)
  })

  $('#clear').click((e) => {
    e.preventDefault()
    clearData()
  })

  $('.edit').click((e) => {
    const drug = e.currentTarget.id.substr(0, e.currentTarget.id.length - 4)
    setupDilutionsDialog(drug)
    $('#editModal').modal()
  })

  $('#inlineFormInput2').change(() => {
    guessWeight()
  })

  $('#inlineFormInput2').keyup(() => {
    guessWeight()
  })

  $('#customSwitch1').click(() => {
    showOrHideCustom()
  })

  $('#saveCustom').click(() => {
    saveCustom()
  })

  $('#disclaimer').click(() => {
    $('#showDisclaimer').modal()
  })

  $('#unitsAppendConc').click((e) => {
    e.preventDefault()
    if ($('#unitsAppendConc').hasClass('disabled') === false) {
      toggleUnits()
    }
  })

  // set initial app state
  showOrHideCustom()
  formatDilutions()
  $('#calc').removeClass('disabled')
  $('#clear').removeClass('disabled')
  $('#showDisclaimer').modal()
})
