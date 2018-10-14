// Application variables

var recordings = {
  recording_01: {
  	path: "../assets/recording_01", 
  	Description: "Description", 
  	Score: "Score",
  	StopWords: {
  		uhh: 10,
  		the: 20,
  		umm: 10,
  		and: 25,
  		I: 7,
  		yes: 12,
  		no: 15,
  		maybe: 16,
  		after: 5,
  		lets: 12,
  	},
  },
  recording_02: {
  	path: "../assets/recording_02", 
  	Description: "Description", 
  	Score: "Score",
  	StopWords: {
  		uhh: 10,
  		the: 20,
  		umm: 10,
  		and: 25,
  		I: 7,
  		yes: 12,
  		no: 15,
  		maybe: 16,
  		after: 5,
  		lets: 12,
  	},
  },
  recording_03: {
  	path: "../assets/recording_03", 
  	Description: "Description", 
  	Score: "Score",
  	StopWords: {
  		uhh: 10,
  		the: 20,
  		umm: 10,
  		and: 25,
  		I: 7,
  		yes: 12,
  		no: 15,
  		maybe: 16,
  		after: 5,
  		lets: 12,
  	},
  },
  recording_04: {
  	path: "../assets/recording_04", 
  	Description: "Description", 
  	Score: "Score",
  	StopWords: {
  		uhh: 10,
  		the: 20,
  		umm: 10,
  		and: 25,
  		I: 7,
  		yes: 12,
  		no: 15,
  		maybe: 16,
  		after: 5,
  		lets: 12,
  	}
  }
};

var settings = {
	setting_A: {
		icon: "ios-american-football",
		status: "off"
	},
	setting_B: {
		icon: "ios-bluetooth",
		status: "off"
	},
	setting_C: {
		icon: "ios-flashlight",
		status: "off"
	},
	setting_D: {
		icon: "ios-key",
		status: "off"
	},
	setting_E: {
		icon: "ios-notifications",
		status: "off"
	},
	setting_F: {
		icon: "ios-power",
		status: "off"
	},
	setting_G: {
		icon: "ios-save",
		status: "off"
	} 
}

module.exports = {
  recordings,
  settings,
};