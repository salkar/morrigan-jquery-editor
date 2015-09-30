def start_editor(params: nil)
  @b.execute_script(
      <<-JS
        editor = $('#editor').morrigan_editor({
                      #{params || "iframeStyles: '/css/iframe.css'"}
                  });
      JS
  )
  @iframe = @b.iframe(class: 'mrge-content-iframe')
  @iframe.wait_until_present
end

def editor
  @b.div(id: 'editor').when_present
end

def iframe_doctype
  @b.execute_script(
        <<-JS
          var doctype = $('iframe.mrge-content-iframe').contents()[0].doctype;
          return '<!DOCTYPE '
            + doctype.name
            + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '')
            + (!doctype.publicId && doctype.systemId ? ' SYSTEM' : '')
            + (doctype.systemId ? ' "' + doctype.systemId + '"' : '')
            + '>'
        JS
  )
end

def actions
  @b.as(class: 'mrge-action')
end