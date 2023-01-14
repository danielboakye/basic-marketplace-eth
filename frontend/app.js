App = {
    contract: {},
    init: async function() {
        console.log("init");

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let userAddress = await signer.getAddress();

        $("#wallet").html("Your wallet address is: <span class='alert alert-secondary text-danger pt-1 pb-1'>" + userAddress + "</span>");

        const resourceAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

        // ../sampleData.json

        $.getJSON(
            "../artifacts/contracts/BasicMarketplace.sol/BasicMarketplace.json", 
            function(BasicMarketplaceArtifact){
                const contract = new ethers.Contract(
                    resourceAddress,
                    BasicMarketplaceArtifact.abi,
                    signer
                );

                App.contract = contract;
                
                contract.getProducts().then((data)=> {
                    console.log(data);

                    var allItemDiv = $("#allItems");
                    var itemTemplate = $("#itemTemplate");
                    for (let i = 0; i < data.length; i++) {
                        itemTemplate.find(".itemName").text(data[i].itemName);
                        itemTemplate.find(".itemOwner").text(data[i].owner);
                        itemTemplate.find(".itemCreator").text(data[i].creator);
                        itemTemplate.find(".askingPrice").text(data[i].askingPrice);
                        itemTemplate
                            .find(".itemStatus")
                            .text(data[i].isSold ? "Sold" : "Available");
                        itemTemplate.find(".buy_btn").attr('data-id', data[i].id);
                        if(data[i].isSold){
                            itemTemplate.find(".buy_btn").hide();
                        } else {
                            itemTemplate.find(".buy_btn").show();
                        }
                        
                        allItemDiv.append(itemTemplate.html());
                    }
                });
            });

        return App.bindEvents();
    },

    bindEvents: function(){
        $(document).on('click', ".btn_add", App.handleAdd);
        $(document).on('click', ".buy_btn", {id: this.id}, App.handleBuy);
    },

    handleAdd: function(){
        console.log("handling add item ...");
        var newItemName = $("#new_itemname").val();
        var newAskingPrice = $("#new_askingprice").val();

        App.contract.addProduct(newItemName, newAskingPrice);
    },

    handleBuy: function(event){
        var productId = parseInt($(event.target).data("id"));
        console.log("handling buy product for id ", productId)

        App.contract.sellProduct(productId);
    }
    
}

$(function() {
    $(window).on('load', function(){
        App.init();
    })
})