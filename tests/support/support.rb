def start_editor(params: nil)
  @b.execute_script(
      <<-JS
        editor = $('#editor').morrigan_editor({
                      #{params || "iframeStyles: '/css/iframe.css'"}
                  });
      JS
  )
  @iframe = @b.iframe(class: 'mrge-content-iframe').wait_until_present
end
