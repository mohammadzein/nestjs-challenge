const app = require("./app")
// @ponicode
describe("app.default.data", () => {
    test("0", () => {
        let callFunction = () => {
            app.default.data()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("app.default.mounted", () => {
    test("0", () => {
        let callFunction = () => {
            app.default.mounted()
        }
    
        expect(callFunction).not.toThrow()
    })
})
