document.getElementById("nextPage").addEventListener("click", function() {
    // Select the original element
    let originalElement = document.getElementById("textArea");
  
    // Create a deep copy (includes all child nodes)
    let clonedElement = originalElement.cloneNode(true);
    clonedElement.value="";
    // Append the cloned element to the container
    document.getElementById("document").append(clonedElement);
  });
  