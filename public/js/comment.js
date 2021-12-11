const newCommentHandler = async (event) => {
    event.preventDefault();
    console.log("NEW COMMENT")
    const description = document.querySelector('#commentDesc').value.trim();

    if (description) {
        const response = await fetch('/api/comment', {
            method: 'POST',
            body: JSON.stringify({description}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert('Failed to create comment');
        }
    }
;}

document
    .querySelector('.new-comment')
    .addEventListener('submit', newCommentHandler);